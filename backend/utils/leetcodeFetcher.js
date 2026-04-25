import axios from 'axios';

export const fetchLeetcodeStats = async (username) => {
    const defaultStats = { total: 0, easy: 0, medium: 0, hard: 0 };
    if (!username) return defaultStats;
    
    // allow passing a URL instead of a username just in case they ignored instructions
    let uName = username.trim();
    if (uName.startsWith('http')) {
        try {
            const parts = new URL(uName).pathname.split('/').filter(Boolean);
            uName = parts[parts.length - 1];
        } catch(e) {}
    }

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
            variables: { username: uName }
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
