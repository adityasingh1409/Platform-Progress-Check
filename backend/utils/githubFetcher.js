import axios from 'axios';

export const fetchGithubStats = async (username) => {
    const defaultStats = { totalCommits: 0, recentCommits: [], contributions: [] };
    if (!username) return defaultStats;

    try {
        // Fetch recent events for recent commits
        const eventsRes = await axios.get(`https://api.github.com/users/${username}/events/public`, {
            headers: { 'User-Agent': 'ProgressTracker-App' }
        });
        
        const recentCommits = [];
        let totalCommits = 0;
        
        const pushEvents = eventsRes.data.filter(e => e.type === 'PushEvent');
        pushEvents.forEach(event => {
            totalCommits += event.payload.commits.length;
            event.payload.commits.forEach(c => {
                recentCommits.push({
                    repo: event.repo.name,
                    message: c.message,
                    date: event.created_at,
                    sha: c.sha
                });
            });
        });

        // To properly build a heatmap, we'll hit a public contributions API endpoint
        // since REST API doesn't provide yearly heatmap cleanly.
        let heatmapData = [];
        try {
            const heatmapRes = await axios.get(`https://github-contributions-api.deno.dev/${username}.json`);
            heatmapData = heatmapRes.data.contributions || [];
            
            if (heatmapRes.data.totalContributions) {
                totalCommits = heatmapRes.data.totalContributions; // broader metric
            }
        } catch (e) {
            console.error('Heatmap fetch fallback:', e.message);
        }

        return {
            totalCommits,
            recentCommits: recentCommits.slice(0, 10), // return top 10
            contributions: heatmapData // The daily breakdown for the heatmap
        };
    } catch (err) {
        console.error('GitHub fetch error:', err.message);
        return defaultStats;
    }
};
