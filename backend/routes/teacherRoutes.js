const express = require('express');
const router = express.Router();
const {
    getAssignedStudents,
    getAnalytics,
    addFeedback,
    getFeedback,
    getMyFeedback
} = require('../controllers/teacherController');
const { protect, checkApproval, authorize } = require('../middleware/auth');

// Teacher routes
router.get('/students', protect, checkApproval, authorize('teacher'), getAssignedStudents);
router.get('/analytics', protect, checkApproval, authorize('teacher'), getAnalytics);
router.post('/feedback', protect, checkApproval, authorize('teacher'), addFeedback);
router.get('/feedback', protect, checkApproval, authorize('teacher'), getFeedback);

// Student route to get their feedback
router.get('/my-feedback', protect, checkApproval, authorize('student'), getMyFeedback);

module.exports = router;
