import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  leetcodeTotal: { type: Number, default: 0 },
  leetcodeEasy: { type: Number, default: 0 },
  leetcodeMedium: { type: Number, default: 0 },
  leetcodeHard: { type: Number, default: 0 },
  totalSolved: { type: Number, default: 0 }
}, { timestamps: true });

// Ensure unique entry per user per day
ProgressSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Progress', ProgressSchema);
