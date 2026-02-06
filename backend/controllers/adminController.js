const User = require('../models/User');
const Progress = require('../models/Progress');
const Profile = require('../models/Profile');
const Feedback = require('../models/Feedback');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const { role, isApproved, batch } = req.query;

        let query = {};
        if (role) query.role = role;
        if (isApproved !== undefined) query.isApproved = isApproved === 'true';
        if (batch) query.batch = batch;

        const users = await User.find(query).select('-password').sort('-createdAt');

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Approve user
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin)
exports.approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isApproved = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User approved successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Reject/Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete admin users'
            });
        }

        // Delete associated data
        await Profile.deleteOne({ user: user._id });
        await Progress.deleteMany({ user: user._id });
        await Feedback.deleteMany({ $or: [{ student: user._id }, { teacher: user._id }] });
        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Assign teacher to students
// @route   POST /api/admin/assign-teacher
// @access  Private (Admin)
exports.assignTeacher = async (req, res) => {
    try {
        const { teacherId, studentIds, batch } = req.body;

        // Verify teacher exists
        const teacher = await User.findOne({ _id: teacherId, role: 'teacher' });
        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        // Update students
        let query = { role: 'student' };
        if (studentIds && studentIds.length > 0) {
            query._id = { $in: studentIds };
        } else if (batch) {
            query.batch = batch;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please provide either studentIds or batch'
            });
        }

        const result = await User.updateMany(query, {
            assignedTeacher: teacherId
        });

        res.status(200).json({
            success: true,
            message: `Assigned teacher to ${result.modifiedCount} students`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user role or batch
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
    try {
        const { role, batch, isApproved } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (role) user.role = role;
        if (batch !== undefined) user.batch = batch;
        if (isApproved !== undefined) user.isApproved = isApproved;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getSystemAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const pendingApprovals = await User.countDocuments({ isApproved: false, role: { $ne: 'admin' } });

        const totalProgress = await Progress.countDocuments();

        // Platform-wise statistics
        const platformStats = await Progress.aggregate([
            {
                $group: {
                    _id: '$platform',
                    totalSolved: { $sum: '$totalSolved' },
                    avgSolved: { $avg: '$totalSolved' },
                    students: { $addToSet: '$user' }
                }
            }
        ]);

        // Batch-wise statistics
        const batchStats = await User.aggregate([
            {
                $match: { role: 'student', batch: { $ne: null } }
            },
            {
                $group: {
                    _id: '$batch',
                    count: { $sum: 1 },
                    approved: {
                        $sum: { $cond: ['$isApproved', 1, 0] }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                users: {
                    total: totalUsers,
                    students: totalStudents,
                    teachers: totalTeachers,
                    pendingApprovals
                },
                progress: {
                    totalRecords: totalProgress,
                    byPlatform: platformStats
                },
                batches: batchStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
