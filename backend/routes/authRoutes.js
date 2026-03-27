import express from 'express';
import { register, login, updatePlatforms, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/platforms', protect, updatePlatforms);
router.get('/profile', protect, getProfile);

export default router;
