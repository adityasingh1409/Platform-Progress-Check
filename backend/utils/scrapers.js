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
