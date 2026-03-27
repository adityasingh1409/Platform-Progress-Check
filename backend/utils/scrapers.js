import axios from 'axios';
import * as cheerio from 'cheerio';

export const fetchLeetcodeStats = async (username) => {
    if (!username) return 0;
    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query: `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        submitStats {
                            acSubmissionNum {
                                count
                                difficulty
                            }
                        }
                    }
                }
            `,
            variables: { username }
        });
        const stats = response.data?.data?.matchedUser?.submitStats?.acSubmissionNum;
        if (stats && stats.length > 0) {
            // "All" is the first element
            const allSolved = stats.find(s => s.difficulty === 'All');
            return allSolved ? allSolved.count : 0;
        }
        return 0;
    } catch (err) {
        console.error('LeetCode fetch error:', err.message);
        return 0;
    }
};

export const fetchGFGStats = async (username) => {
    if (!username) return 0;
    try {
        const { data } = await axios.get(`https://www.geeksforgeeks.org/user/${username}/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });
        const $ = cheerio.load(data);
        // Find text saying "Problems Solved" or look for typical GFG class structures
        // Best effort basic parse, since GFG dom changes often. 
        // Currently, it usually has a span/div with text 'Overall Coding Score' or similar. 
        // For simplicity in this demo, let's grab score or total solved.
        let solved = 0;
        $('.scoreCard_head_left--text__ab11S').each((i, el) => {
             // Fallback scraping class name, often dynamic.
        });
        // Simplistic approach for robust scraping is via regex if class names are missing:
        const match = data.match(/Solve Problem.*?(\d+)/i) || data.match(/Problems Solved.*?(\d+)/i) || data.match(/"problemsSolved":(\d+)/) || data.match(/Problem Solved.*?<.*?>(.*?)</i);
        if (match && match[1]) {
            solved = parseInt(match[1]);
        }
        return isNaN(solved) ? 0 : solved;
    } catch (err) {
        console.error('GFG script fetch error:', err.message); // might 403 or 404
        return 0;
    }
};

export const fetchHackerrankStats = async (username) => {
    if (!username) return 0;
    try {
        // HackerRank has a badges API or open profile data.
        const { data } = await axios.get(`https://www.hackerrank.com/rest/hackers/${username}/badges`, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        if (data && data.models) {
            // Count stars or rely on some other metric
            let sum = 0;
            data.models.forEach(model => {
                sum += (model.stars || 0);
            });
            // Approximate number of problems based on badges
            return sum * 10; 
        }
        return 0;
    } catch (err) {
        console.error('HackerRank fetch error:', err.message);
        return 0;
    }
};
