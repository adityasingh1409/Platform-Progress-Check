import express from 'express';
import { protect, adminProtect } from '../middleware/authMiddleware.js';
import { getAllUsers, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', protect, adminProtect, getAllUsers);
router.delete('/users/:id', protect, adminProtect, deleteUser);

export default router;
