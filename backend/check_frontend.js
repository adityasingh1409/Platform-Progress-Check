import mongoose from 'mongoose';
import User from './models/User.js';
import Progress from './models/Progress.js';
import dotenv from 'dotenv';
import { fetchLeetcodeStats } from './utils/scrapers.js';
dotenv.config();

async function checkFrontendPayload() {
    await mongoose.connect(process.env.MONGO_URI);
    const today = new Date().toISOString().split('T')[0];
    const progresses = await Progress.find({ date: today }).populate('user');
    for (const p of progresses) {
        console.log(`Progress for ${p.user?.username || 'unknown'}:`);
        console.log(`totalSolved: ${p.totalSolved}, leetcodeTotal: ${p.leetcodeTotal}`);
        console.log(`Payload JSON stringified: `, JSON.stringify(p.toJSON(), null, 2));
    }
    process.exit(0);
}
checkFrontendPayload();
