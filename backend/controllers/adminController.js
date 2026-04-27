import User from '../models/User.js';
import Progress from '../models/Progress.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        
        // Also fetch latest progress for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const latestProgress = await Progress.findOne({ user: user._id }).sort({ date: -1 });
            return {
                ...user.toObject(),
                stats: latestProgress || null
            };
        }));
        
        res.status(200).json(usersWithStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        await Progress.deleteMany({ user: user._id });
        await User.deleteOne({ _id: user._id });
        
        res.status(200).json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting user' });
    }
};
