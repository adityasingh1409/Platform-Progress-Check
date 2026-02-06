const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape LeetCode profile using GraphQL API
 * LeetCode has a public GraphQL endpoint that can be used
 */
const scrapeLeetCode = async (profileUrl) => {
    try {
        // Extract username from URL
        const username = profileUrl.split('/').filter(Boolean).pop();

        // LeetCode GraphQL endpoint
        const graphqlEndpoint = 'https://leetcode.com/graphql';

        // GraphQL query for user profile
        const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
          }
        }
        recentSubmissionList(username: $username, limit: 10) {
          title
          timestamp
          statusDisplay
        }
      }
    `;

        const response = await axios.post(graphqlEndpoint, {
            query,
            variables: { username }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            }
        });

        const data = response.data.data;

        if (!data || !data.matchedUser) {
            throw new Error('User not found on LeetCode');
        }

        const submissions = data.matchedUser.submitStats.acSubmissionNum;

        // Parse difficulty-wise submissions
        let easySolved = 0, mediumSolved = 0, hardSolved = 0, totalSolved = 0;

        submissions.forEach(sub => {
            if (sub.difficulty === 'Easy') easySolved = sub.count;
            if (sub.difficulty === 'Medium') mediumSolved = sub.count;
            if (sub.difficulty === 'Hard') hardSolved = sub.count;
            if (sub.difficulty === 'All') totalSolved = sub.count;
        });

        const recentSubmissions = data.recentSubmissionList ?
            data.recentSubmissionList.map(sub => ({
                title: sub.title,
                difficulty: 'Unknown',
                timestamp: new Date(parseInt(sub.timestamp) * 1000),
                status: sub.statusDisplay
            })) : [];

        return {
            platform: 'leetcode',
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            ranking: data.matchedUser.profile.ranking || null,
            reputation: data.matchedUser.profile.reputation || 0,
            streak: 0, // LeetCode doesn't provide streak in this API
            acceptanceRate: 0,
            badges: [],
            recentSubmissions,
            lastScraped: new Date()
        };

    } catch (error) {
        console.error('LeetCode scraping error:', error.message);
        throw new Error(`Failed to scrape LeetCode profile: ${error.message}`);
    }
};

module.exports = scrapeLeetCode;
