import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { fetchLeetcodeStats, fetchGfgStats, fetchHackerrankStats } from '../utils/scrapers.js';

export const syncStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const leetcodeStats = await fetchLeetcodeStats(user.platforms?.leetcode);
        const gfgStats = await fetchGfgStats(user.platforms?.gfg);
        const hackerrankStats = await fetchHackerrankStats(user.platforms?.hackerrank);

        const totalSolved = leetcodeStats.total + gfgStats.total + hackerrankStats.total;

        const today = new Date().toISOString().split('T')[0];

        let progress = await Progress.findOne({ user: user._id, date: today });
        if (progress) {
            progress.leetcodeTotal = leetcodeStats.total;
            progress.leetcodeEasy = leetcodeStats.easy;
            progress.leetcodeMedium = leetcodeStats.medium;
            progress.leetcodeHard = leetcodeStats.hard;
            
            progress.gfgTotal = gfgStats.total;
            progress.gfgEasy = gfgStats.easy;
            progress.gfgMedium = gfgStats.medium;
            progress.gfgHard = gfgStats.hard;
            
            progress.hackerrankTotal = hackerrankStats.total;
            progress.hackerrankEasy = hackerrankStats.easy;
            progress.hackerrankMedium = hackerrankStats.medium;
            progress.hackerrankHard = hackerrankStats.hard;
            
            progress.totalSolved = totalSolved;
            await progress.save();
        } else {
            progress = new Progress({
                user: user._id,
                date: today,
                leetcodeTotal: leetcodeStats.total,
                leetcodeEasy: leetcodeStats.easy,
                leetcodeMedium: leetcodeStats.medium,
                leetcodeHard: leetcodeStats.hard,
                gfgTotal: gfgStats.total,
                gfgEasy: gfgStats.easy,
                gfgMedium: gfgStats.medium,
                gfgHard: gfgStats.hard,
                hackerrankTotal: hackerrankStats.total,
                hackerrankEasy: hackerrankStats.easy,
                hackerrankMedium: hackerrankStats.medium,
                hackerrankHard: hackerrankStats.hard,
                totalSolved
            });
            await progress.save();
            
            // basic consistency logic: increment consistency
            user.consistencyScore += 1;
            await user.save();
        }

        res.status(200).json({ progress, consistencyScore: user.consistencyScore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while syncing stats' });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find().select('username consistencyScore').sort({ consistencyScore: -1 }).limit(20);
        const today = new Date().toISOString().split('T')[0];
        const progressList = await Progress.find({ date: today }).populate('user', 'username consistencyScore');

        // Merge total solved dynamically from today's progress document into the user payload
        const formattedLeaderboard = users.map(u => {
            const p = progressList.find(prog => prog.user._id.toString() === u._id.toString());
            return {
                ...u._doc,
                totalProblemCount: p ? p.totalSolved : 0
            };
        });

        // Re-sort by total problem count implicitly or just leave consistency
        formattedLeaderboard.sort((a, b) => b.totalProblemCount - a.totalProblemCount || b.consistencyScore - a.consistencyScore);

        res.status(200).json({ leaderboard: formattedLeaderboard, progress: progressList });
    } catch (error) {
        res.status(500).json({ message: 'Server error Fetching leaderboard' });
    }
};
