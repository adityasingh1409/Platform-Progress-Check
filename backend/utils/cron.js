import cron from 'node-cron';
import User from '../models/User.js';
import { fetchLeetcodeStats } from './leetcodeFetcher.js';
import { fetchGithubStats } from './githubFetcher.js';
import Progress from '../models/Progress.js';

export const startCronJob = () => {
    // Run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
        console.log('🔄 Running scheduled auto-sync for all users...');
        try {
            const users = await User.find({});
            for (const user of users) {
                if (!user.githubUsername && !user.leetcodeUsername) continue;

                // Sync logic matches what's in statsController
                const lcStats = await fetchLeetcodeStats(user.leetcodeUsername);
                const ghStats = await fetchGithubStats(user.githubUsername);
                
                const totalSolved = lcStats.total + ghStats.totalCommits;
                const today = new Date().toISOString().split('T')[0];
                
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
            
                const yesterdayProgress = await Progress.findOne({ user: user._id, date: yesterdayStr });
                const todayProgressBeforeUpdate = await Progress.findOne({ user: user._id, date: today });
                
                let previousTotal = yesterdayProgress ? yesterdayProgress.totalSolved : 0;
                
                let newStreak = yesterdayProgress ? yesterdayProgress.streak : 0;
                if (totalSolved > previousTotal) {
                    if (!todayProgressBeforeUpdate || todayProgressBeforeUpdate.totalSolved <= previousTotal) {
                        newStreak += 1;
                    }
                } else if (todayProgressBeforeUpdate && todayProgressBeforeUpdate.totalSolved > previousTotal) {
                     newStreak = todayProgressBeforeUpdate.streak;
                } else {
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
            }
            console.log('✅ Scheduled auto-sync complete.');
        } catch (err) {
            console.error('❌ Scheduled auto-sync failed:', err.message);
        }
    });
};
