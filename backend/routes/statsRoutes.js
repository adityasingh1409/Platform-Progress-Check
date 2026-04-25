import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { syncStats, getLeaderboard, getMyStats, getPublicProfile } from '../controllers/statsController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const syncLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many syncs from this IP' });

router.get('/sync', protect, syncLimiter, syncStats);
router.post('/sync', protect, syncLimiter, syncStats); // keeping post for backward compat
router.get('/me', protect, getMyStats);
router.get('/leaderboard', getLeaderboard);
router.get('/user/:username/public', getPublicProfile);

export default router;
