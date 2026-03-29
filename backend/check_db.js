import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkUser() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({});
    console.log(`Found ${users.length} users in DB.`);
    for (const u of users) {
        console.log(`User: ${u.username}, Platforms:`, u.platforms);
    }
    process.exit(0);
}
checkUser();
