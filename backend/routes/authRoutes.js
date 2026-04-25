import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, updatePlatforms, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const validateRegistration = [
    body('username').notEmpty().withMessage('Username is required').trim().escape(),
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.put('/platforms', protect, updatePlatforms);
router.get('/profile', protect, getProfile);

export default router;
