const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    syncProgress,
    getProgress,
    getAllStudents,
    getStudentProgress
} = require('../controllers/studentController');
const { protect, checkApproval, authorize } = require('../middleware/auth');

// Student routes (own profile)
router.get('/profile', protect, checkApproval, authorize('student'), getProfile);
router.put('/profile', protect, checkApproval, authorize('student'), updateProfile);
router.post('/sync-progress', protect, checkApproval, authorize('student'), syncProgress);
router.get('/progress', protect, checkApproval, authorize('student'), getProgress);

// Teacher/Admin routes (view all students)
router.get('/', protect, checkApproval, authorize('teacher', 'admin'), getAllStudents);
router.get('/:id/progress', protect, checkApproval, authorize('teacher', 'admin'), getStudentProgress);

module.exports = router;
