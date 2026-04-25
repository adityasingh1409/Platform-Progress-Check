import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { fetchLeetcodeStats } from '../utils/leetcodeFetcher.js';
import { fetchGithubStats } from '../utils/githubFetcher.js';
import cache from '../utils/cache.js';

const fetchAndUpdateUserStats = async (user) => {
    // Check Cache first
    const cacheKey = `stats_${user._id}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    const lcStats = await fetchLeetcodeStats(user.leetcodeUsername);
    const ghStats = await fetchGithubStats(user.githubUsername);

    const totalSolved = lcStats.total + ghStats.totalCommits; // Combined activity indicator
    const today = new Date().toISOString().split('T')[0];
    
    // Streak calculation (consecutive days where problems solved today > yesterday's count)
    // Wait, the logic is easier: find yesterday's progress. 
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const yesterdayProgress = await Progress.findOne({ user: user._id, date: yesterdayStr });
    const todayProgressBeforeUpdate = await Progress.findOne({ user: user._id, date: today });
    
    let previousTotal = yesterdayProgress ? yesterdayProgress.totalSolved : 0;
    
    // Calculate streak
    let newStreak = yesterdayProgress ? yesterdayProgress.streak : 0;
    if (totalSolved > previousTotal) {
        // Did they already make progress today so we already counted it?
        if (!todayProgressBeforeUpdate || todayProgressBeforeUpdate.totalSolved <= previousTotal) {
            newStreak += 1;
        }
    } else if (todayProgressBeforeUpdate && todayProgressBeforeUpdate.totalSolved > previousTotal) {
         // keep the streak from earlier today
         newStreak = todayProgressBeforeUpdate.streak;
    } else {
        // lost streak
        newStreak = 0;
    }

    let progress = todayProgressBeforeUpdate || new Progress({ user: user._id, date: today });
    
    progress.githubCommits = ghStats.totalCommits;
    progress.lcEasy = lcStats.easy;
    progress.lcMedium = lcStats.medium;
    progress.lcHard = lcStats.hard;
    progress.totalSolved = totalSolved;
    progress.streak = newStreak;
    
    await progress.save();

    const responseData = { progress, recentCommits: ghStats.recentCommits, contributions: ghStats.contributions };
    cache.set(cacheKey, responseData);
    return responseData;
};

// GET /stats/me
export const getMyStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const data = await fetchAndUpdateUserStats(user);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching your stats' });
    }
};

// GET /stats/sync - manual override (clears cache)
export const syncStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        cache.del(`stats_${user._id}`);
        const data = await fetchAndUpdateUserStats(user);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while syncing stats' });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Find today's progress, sort by streak descending
        const progressList = await Progress.find({ date: today })
            .populate('user', 'username githubUsername leetcodeUsername')
            .sort({ streak: -1 })
            .limit(20);
            
        res.status(200).json({ leaderboard: progressList });
    } catch (error) {
        res.status(500).json({ message: 'Server error Fetching leaderboard' });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const data = await fetchAndUpdateUserStats(user);
        res.status(200).json({
            user: { username: user.username, githubUsername: user.githubUsername, leetcodeUsername: user.leetcodeUsername },
            stats: data
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching public profile' });
    }
};
