const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    approveUser,
    deleteUser,
    assignTeacher,
    updateUser,
    getSystemAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin role
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.put('/users/:id/approve', approveUser);
router.delete('/users/:id', deleteUser);
router.post('/assign-teacher', assignTeacher);
router.get('/analytics', getSystemAnalytics);

module.exports = router;
