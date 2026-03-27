import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { fetchLeetcodeStats, fetchGFGStats, fetchHackerrankStats } from '../utils/scrapers.js';

export const syncStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const leetcodeSolved = await fetchLeetcodeStats(user.platforms?.leetcode);
        const gfgSolved = await fetchGFGStats(user.platforms?.gfg);
        const hackerrankSolved = await fetchHackerrankStats(user.platforms?.hackerrank);

        const totalSolved = leetcodeSolved + gfgSolved + hackerrankSolved;

        const today = new Date().toISOString().split('T')[0];

        let progress = await Progress.findOne({ user: user._id, date: today });
        if (progress) {
            progress.leetcodeSolved = leetcodeSolved;
            progress.gfgSolved = gfgSolved;
            progress.hackerrankSolved = hackerrankSolved;
            progress.totalSolved = totalSolved;
            await progress.save();
        } else {
            progress = new Progress({
                user: user._id,
                date: today,
                leetcodeSolved,
                gfgSolved,
                hackerrankSolved,
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
        // Find users sorted by consistencyScore and total solved dynamically or from daily max
        const users = await User.find().select('username consistencyScore').sort({ consistencyScore: -1 }).limit(20);
        
        // Populate today's progress to get the total solved count for leaderboard
        const today = new Date().toISOString().split('T')[0];
        const progressList = await Progress.find({ date: today }).populate('user', 'username consistencyScore');

        // Let's rely on consistency and fallback to some DB stats
        res.status(200).json({ leaderboard: users, progress: progressList });
    } catch (error) {
        res.status(500).json({ message: 'Server error Fetching leaderboard' });
    }
};
