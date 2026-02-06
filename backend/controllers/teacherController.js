const User = require('../models/User');
const Progress = require('../models/Progress');
const Feedback = require('../models/Feedback');

// @desc    Get assigned students
// @route   GET /api/teachers/students
// @access  Private (Teacher)
exports.getAssignedStudents = async (req, res) => {
    try {
        const students = await User.find({
            role: 'student',
            assignedTeacher: req.user.id,
            isApproved: true
        }).select('-password');

        res.status(200).json({
            success: true,
            count: students.length,
            students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get batch-wise analytics
// @route   GET /api/teachers/analytics
// @access  Private (Teacher)
exports.getAnalytics = async (req, res) => {
    try {
        const { batch, platform, startDate, endDate } = req.query;

        // Build query
        let studentQuery = {
            role: 'student',
            assignedTeacher: req.user.id,
            isApproved: true
        };

        if (batch) {
            studentQuery.batch = batch;
        }

        const students = await User.find(studentQuery);
        const studentIds = students.map(s => s._id);

        // Get progress for these students
        let progressQuery = { user: { $in: studentIds } };

        if (platform) {
            progressQuery.platform = platform;
        }

        if (startDate || endDate) {
            progressQuery.lastScraped = {};
            if (startDate) progressQuery.lastScraped.$gte = new Date(startDate);
            if (endDate) progressQuery.lastScraped.$lte = new Date(endDate);
        }

        const progressData = await Progress.find(progressQuery).populate('user', 'name email batch');

        // Calculate analytics
        const analytics = {
            totalStudents: students.length,
            platforms: {},
            batchWise: {},
            topPerformers: [],
            averageProgress: {
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0
            }
        };

        // Group by platform
        progressData.forEach(prog => {
            if (!analytics.platforms[prog.platform]) {
                analytics.platforms[prog.platform] = {
                    totalSolved: 0,
                    easySolved: 0,
                    mediumSolved: 0,
                    hardSolved: 0,
                    studentCount: 0
                };
            }

            analytics.platforms[prog.platform].totalSolved += prog.totalSolved;
            analytics.platforms[prog.platform].easySolved += prog.easySolved;
            analytics.platforms[prog.platform].mediumSolved += prog.mediumSolved;
            analytics.platforms[prog.platform].hardSolved += prog.hardSolved;
            analytics.platforms[prog.platform].studentCount++;
        });

        // Calculate averages
        if (progressData.length > 0) {
            const totalProblems = progressData.reduce((sum, p) => sum + p.totalSolved, 0);
            const totalEasy = progressData.reduce((sum, p) => sum + p.easySolved, 0);
            const totalMedium = progressData.reduce((sum, p) => sum + p.mediumSolved, 0);
            const totalHard = progressData.reduce((sum, p) => sum + p.hardSolved, 0);

            analytics.averageProgress.totalSolved = Math.round(totalProblems / progressData.length);
            analytics.averageProgress.easySolved = Math.round(totalEasy / progressData.length);
            analytics.averageProgress.mediumSolved = Math.round(totalMedium / progressData.length);
            analytics.averageProgress.hardSolved = Math.round(totalHard / progressData.length);
        }

        // Get top performers
        const studentProgress = {};
        progressData.forEach(prog => {
            const userId = prog.user._id.toString();
            if (!studentProgress[userId]) {
                studentProgress[userId] = {
                    student: prog.user,
                    totalSolved: 0
                };
            }
            studentProgress[userId].totalSolved += prog.totalSolved;
        });

        analytics.topPerformers = Object.values(studentProgress)
            .sort((a, b) => b.totalSolved - a.totalSolved)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add feedback for student
// @route   POST /api/teachers/feedback
// @access  Private (Teacher)
exports.addFeedback = async (req, res) => {
    try {
        const { studentId, message, category } = req.body;

        // Check if student exists and is assigned to this teacher
        const student = await User.findOne({
            _id: studentId,
            role: 'student',
            assignedTeacher: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found or not assigned to you'
            });
        }

        const feedback = await Feedback.create({
            student: studentId,
            teacher: req.user.id,
            message,
            category: category || 'suggestion'
        });

        res.status(201).json({
            success: true,
            message: 'Feedback added successfully',
            feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get feedback given by teacher
// @route   GET /api/teachers/feedback
// @access  Private (Teacher)
exports.getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ teacher: req.user.id })
            .populate('student', 'name email batch')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: feedback.length,
            feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get student feedback (for students)
// @route   GET /api/teachers/my-feedback
// @access  Private (Student)
exports.getMyFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ student: req.user.id })
            .populate('teacher', 'name email')
            .sort('-createdAt');

        // Mark as read
        await Feedback.updateMany(
            { student: req.user.id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            count: feedback.length,
            feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
