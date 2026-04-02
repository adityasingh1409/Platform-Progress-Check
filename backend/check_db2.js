import mongoose from 'mongoose';
import User from './models/User.js';
import Progress from './models/Progress.js';
import dotenv from 'dotenv';
import { fetchLeetcodeStats, fetchGfgStats, fetchHackerrankStats } from './utils/scrapers.js';
dotenv.config();

async function checkOldSync() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    console.log(`Found ${users.length} users in DB.`);
    
    // Attempt sync for everyone
    for (const u of users) {
        if (!u.platforms) continue;
        console.log(`Syncing user: ${u.username || 'unknown'}`);
        try {
            const leetcodeStats = await fetchLeetcodeStats(u.platforms.leetcode);
            const gfgStats = await fetchGfgStats(u.platforms.gfg);
            const hackerrankStats = await fetchHackerrankStats(u.platforms.hackerrank);
            const totalSolved = leetcodeStats.total + gfgStats.total + hackerrankStats.total;
            const today = new Date().toISOString().split('T')[0];

            let progress = await Progress.findOne({ user: u._id, date: today });
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
                console.log(`Updated old progress for ${u.username || 'unknown'}.`);
            } else {
                progress = new Progress({
                    user: u._id,
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
                    totalSolved: totalSolved
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
