const Profile = require('../models/Profile');
const Progress = require('../models/Progress');
const User = require('../models/User');
const scrapeLeetCode = require('../scrapers/leetcodeScraper');
const scrapeHackerRank = require('../scrapers/hackerrankScraper');
const scrapeGeeksForGeeks = require('../scrapers/geeksforgeeksScraper');

// @desc    Get or create student profile
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            profile = await Profile.create({ user: req.user.id });
        }

        res.status(200).json({
            success: true,
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update student profile links
// @route   PUT /api/students/profile
// @access  Private (Student)
exports.updateProfile = async (req, res) => {
    try {
        const { leetcodeUrl, hackerrankUrl, geeksforgeeksUrl } = req.body;

        let profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            profile = await Profile.create({
                user: req.user.id,
                leetcodeUrl,
                hackerrankUrl,
                geeksforgeeksUrl
            });
        } else {
            profile.leetcodeUrl = leetcodeUrl || profile.leetcodeUrl;
            profile.hackerrankUrl = hackerrankUrl || profile.hackerrankUrl;
            profile.geeksforgeeksUrl = geeksforgeeksUrl || profile.geeksforgeeksUrl;
            profile.lastUpdated = Date.now();
            await profile.save();
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Fetch and update progress from platforms
// @route   POST /api/students/sync-progress
// @access  Private (Student)
exports.syncProgress = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Please add your profile links first'
            });
        }

        const results = [];

        // Scrape LeetCode
        if (profile.leetcodeUrl) {
            try {
                const leetcodeData = await scrapeLeetCode(profile.leetcodeUrl);

                await Progress.findOneAndUpdate(
                    { user: req.user.id, platform: 'leetcode' },
                    { ...leetcodeData, user: req.user.id },
                    { upsert: true, new: true }
                );

                results.push({ platform: 'leetcode', success: true });
            } catch (error) {
                results.push({ platform: 'leetcode', success: false, error: error.message });
            }
        }

        // Scrape HackerRank
        if (profile.hackerrankUrl) {
            try {
                const hackerrankData = await scrapeHackerRank(profile.hackerrankUrl);

                await Progress.findOneAndUpdate(
                    { user: req.user.id, platform: 'hackerrank' },
                    { ...hackerrankData, user: req.user.id },
                    { upsert: true, new: true }
                );

                results.push({ platform: 'hackerrank', success: true });
            } catch (error) {
                results.push({ platform: 'hackerrank', success: false, error: error.message });
            }
        }

        // Scrape GeeksForGeeks
        if (profile.geeksforgeeksUrl) {
            try {
                const gfgData = await scrapeGeeksForGeeks(profile.geeksforgeeksUrl);

                await Progress.findOneAndUpdate(
                    { user: req.user.id, platform: 'geeksforgeeks' },
                    { ...gfgData, user: req.user.id },
                    { upsert: true, new: true }
                );

                results.push({ platform: 'geeksforgeeks', success: true });
            } catch (error) {
                results.push({ platform: 'geeksforgeeks', success: false, error: error.message });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Progress sync completed',
            results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get student progress
// @route   GET /api/students/progress
// @access  Private (Student)
exports.getProgress = async (req, res) => {
    try {
        const progress = await Progress.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: progress.length,
            progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all students (for teachers/admins)
// @route   GET /api/students
// @access  Private (Teacher, Admin)
exports.getAllStudents = async (req, res) => {
    try {
        let query = { role: 'student' };

        // If teacher, only show assigned students
        if (req.user.role === 'teacher') {
            query.assignedTeacher = req.user.id;
        }

        const students = await User.find(query).select('-password');

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

// @desc    Get specific student progress (for teachers/admins)
// @route   GET /api/students/:id/progress
// @access  Private (Teacher, Admin)
exports.getStudentProgress = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student || student.role !== 'student') {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check if teacher is assigned to this student
        if (req.user.role === 'teacher' && student.assignedTeacher?.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this student'
            });
        }

        const progress = await Progress.find({ user: req.params.id });
        const profile = await Profile.findOne({ user: req.params.id });

        res.status(200).json({
            success: true,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                batch: student.batch
            },
            profile,
            progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
