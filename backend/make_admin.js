import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to DB');
    const users = await User.find({});
    console.log('Users:', users.map(u => ({ username: u.username, role: u.role })));
    
    // Optionally make the first user an admin if there are any and no admin exists
    if (users.length > 0) {
        const hasAdmin = users.some(u => u.role === 'admin');
        if (!hasAdmin) {
            users[0].role = 'admin';
            await users[0].save();
            console.log(`Made ${users[0].username} an admin!`);
        }
    }
    
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
