const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape HackerRank profile
 * Note: HackerRank doesn't have a public API, so we use web scraping
 */
const scrapeHackerRank = async (profileUrl) => {
    try {
        // Extract username from URL
        const username = profileUrl.split('/').filter(Boolean).pop();

        // Fetch the profile page
        const response = await axios.get(profileUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // Extract data from the page
        // Note: HackerRank's structure may change, these selectors are approximate

        let totalSolved = 0;
        let badges = [];

        // Try to extract solved problems count
        $('.profile-stats .stat-value').each((i, elem) => {
            const value = $(elem).text().trim();
            const label = $(elem).siblings('.stat-label').text().trim().toLowerCase();

            if (label.includes('challenges solved') || label.includes('problems solved')) {
                totalSolved = parseInt(value) || 0;
            }
        });

        // Extract badges
        $('.badges-section .badge').each((i, elem) => {
            const badgeName = $(elem).find('.badge-title').text().trim();
            if (badgeName) {
                badges.push({
                    name: badgeName,
                    count: 1
                });
            }
        });

        // Extract ranking if available
        let ranking = null;
        const rankText = $('.profile-rank').text().trim();
        if (rankText) {
            ranking = parseInt(rankText.replace(/\D/g, '')) || null;
        }

        return {
            platform: 'hackerrank',
            totalSolved,
            easySolved: 0, // HackerRank doesn't categorize by difficulty in the same way
            mediumSolved: 0,
            hardSolved: 0,
            ranking,
            reputation: 0,
            streak: 0,
            acceptanceRate: 0,
            badges,
            recentSubmissions: [],
            lastScraped: new Date()
        };

    } catch (error) {
        console.error('HackerRank scraping error:', error.message);

        // Return default data if scraping fails
        return {
            platform: 'hackerrank',
            totalSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            ranking: null,
            reputation: 0,
            streak: 0,
            acceptanceRate: 0,
            badges: [],
            recentSubmissions: [],
            lastScraped: new Date()
        };
    }
};

module.exports = scrapeHackerRank;
