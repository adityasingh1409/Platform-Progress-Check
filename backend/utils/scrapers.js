import axios from 'axios';
import * as cheerio from 'cheerio';

const extractUsername = (urlOrUsername, platform) => {
    if (!urlOrUsername) return '';
    let val = urlOrUsername.trim();
    if (!val.startsWith('http')) return val; // If just a username
    
    try {
        const urlObj = new URL(val);
        const parts = urlObj.pathname.split('/').filter(Boolean);
        if (platform === 'leetcode') {
            return parts[parts.length - 1]; // e.g. /u/user -> user
        }
        if (platform === 'gfg') {
            return parts[parts.length - 1]; // e.g. /user/user -> user
        }
        if (platform === 'hackerrank') {
            return parts[parts.length - 1]; // e.g. /profile/user -> user
        }
    } catch(e) {
        return val;
    }
    return val;
};

export const fetchLeetcodeStats = async (profileUrl) => {
    const username = extractUsername(profileUrl, 'leetcode');
    const defaultStats = { total: 0, easy: 0, medium: 0, hard: 0 };
    if (!username) return defaultStats;
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
            return {
                total: stats.find(s => s.difficulty === 'All')?.count || 0,
                easy: stats.find(s => s.difficulty === 'Easy')?.count || 0,
                medium: stats.find(s => s.difficulty === 'Medium')?.count || 0,
                hard: stats.find(s => s.difficulty === 'Hard')?.count || 0
            };
        }
        return defaultStats;
    } catch (err) {
        console.error('LeetCode fetch error:', err.message);
        return defaultStats;
    }
};

export const fetchGfgStats = async (profileUrl) => {
    const username = extractUsername(profileUrl, 'gfg');
    const defaultStats = { total: 0, easy: 0, medium: 0, hard: 0 };
    if (!username) return defaultStats;
    try {
        const response = await axios.get(`https://auth.geeksforgeeks.org/user/${username}/practice/`);
        const $ = cheerio.load(response.data);
        
        let total = 0, easy = 0, medium = 0, hard = 0;
        
        const tabs = $('.tabs-content-container .active .problem-nav-links li, .nav-wrapper li, a[href*="#"]');
        tabs.each((i, el) => {
             const text = $(el).text();
             if (text.includes('Easy')) easy = parseInt(text.match(/\d+/)?.[0] || '0', 10);
             if (text.includes('Medium')) medium = parseInt(text.match(/\d+/)?.[0] || '0', 10);
             if (text.includes('Hard')) hard = parseInt(text.match(/\d+/)?.[0] || '0', 10);
        });
        total = easy + medium + hard;
        
        return { total, easy, medium, hard };
    } catch (err) {
        console.error('GFG fetch error:', err.message);
        return defaultStats;
    }
};

export const fetchHackerrankStats = async (profileUrl) => {
    const username = extractUsername(profileUrl, 'hackerrank');
    const defaultStats = { total: 0, easy: 0, medium: 0, hard: 0 };
    if (!username) return defaultStats;
    try {
        // Fallback for hackerrank, real scraping requires API key or puppeteer 
        return defaultStats;
    } catch (err) {
        console.error('HackerRank fetch error:', err.message);
        return defaultStats;
    }
};
