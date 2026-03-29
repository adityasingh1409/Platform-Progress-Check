import mongoose from 'mongoose';
import User from './models/User.js';
import Progress from './models/Progress.js';
import dotenv from 'dotenv';
import { fetchLeetcodeStats } from './utils/scrapers.js';
dotenv.config();

async function checkOldSync() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    console.log(`Found ${users.length} users in DB.`);
    
    // Attempt sync for everyone
    for (const u of users) {
        if (!u.platforms || !u.platforms.leetcode) continue;
        console.log(`Syncing user: ${u.username || 'unknown'} with leetcode: ${u.platforms.leetcode}`);
        try {
            const leetcodeStats = await fetchLeetcodeStats(u.platforms.leetcode);
            const today = new Date().toISOString().split('T')[0];

            let progress = await Progress.findOne({ user: u._id, date: today });
            if (progress) {
                progress.leetcodeTotal = leetcodeStats.total;
                progress.leetcodeEasy = leetcodeStats.easy;
                progress.leetcodeMedium = leetcodeStats.medium;
                progress.leetcodeHard = leetcodeStats.hard;
                progress.totalSolved = leetcodeStats.total;
                await progress.save();
                console.log(`Updated old progress for ${u.username || 'unknown'}.`);
            } else {
                progress = new Progress({
                    user: u._id,
                    date: today,
                    leetcodeTotal: leetcodeStats.total,
                    leetcodeEasy: leetcodeStats.easy,
                    leetcodeMedium: leetcodeStats.medium,
                    leetcodeHard: leetcodeStats.hard,
                    totalSolved: leetcodeStats.total
                });
                await progress.save();
                console.log(`Created new progress for ${u.username || 'unknown'}.`);
            }
        } catch(err) {
            console.error(`Sync error for ${u.username || 'unknown'}:`, err.message);
        }
    }
    process.exit(0);
}
checkOldSync();
