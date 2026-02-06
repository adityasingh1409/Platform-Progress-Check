const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape GeeksforGeeks profile
 * Note: GFG doesn't have a public API, so we use web scraping
 */
const scrapeGeeksForGeeks = async (profileUrl) => {
    try {
        // Fetch the profile page
        const response = await axios.get(profileUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // Extract data from the page
        let totalSolved = 0;
        let easySolved = 0;
        let mediumSolved = 0;
        let hardSolved = 0;
        let streak = 0;

        // Try to extract problem counts
        $('.score_card_value, .scoreCard_head_left--score__oSi_x').each((i, elem) => {
            const value = parseInt($(elem).text().trim()) || 0;
            const label = $(elem).parent().find('.score_card_name, .scoreCard_head_left--text__oXh_R').text().trim().toLowerCase();

            if (label.includes('overall coding score') || label.includes('total problems')) {
                totalSolved = value;
            }
            if (label.includes('streak')) {
                streak = value;
            }
        });

        // Try to extract difficulty-wise counts if available
        $('.difficulty_count').each((i, elem) => {
            const difficulty = $(elem).find('.difficulty_name').text().trim().toLowerCase();
            const count = parseInt($(elem).find('.difficulty_value').text().trim()) || 0;

            if (difficulty.includes('easy')) easySolved = count;
            if (difficulty.includes('medium')) mediumSolved = count;
            if (difficulty.includes('hard')) hardSolved = count;
        });

        // Extract ranking
        let ranking = null;
        const rankText = $('.rank_badge, .profilePg_head_userRankContainer__ZZT_Z').text().trim();
        if (rankText) {
            ranking = parseInt(rankText.replace(/\D/g, '')) || null;
        }

        return {
            platform: 'geeksforgeeks',
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            ranking,
            reputation: 0,
            streak,
            acceptanceRate: 0,
            badges: [],
            recentSubmissions: [],
            lastScraped: new Date()
        };

    } catch (error) {
        console.error('GeeksForGeeks scraping error:', error.message);

        // Return default data if scraping fails
        return {
            platform: 'geeksforgeeks',
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

module.exports = scrapeGeeksForGeeks;
