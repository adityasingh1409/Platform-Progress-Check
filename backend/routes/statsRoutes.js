import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { syncStats, getLeaderboard } from '../controllers/statsController.js';

const router = express.Router();

router.post('/sync', protect, syncStats);
router.get('/leaderboard', getLeaderboard);

export default router;
