import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to DB');
    const user = await User.findOne({ username: 'admin131' });
    if (user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash('admin123', salt);
        user.role = 'admin'; // just to be sure
        await user.save();
        console.log('Password for admin131 has been reset to: admin123');
    } else {
        console.log('Admin user not found');
    }
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
