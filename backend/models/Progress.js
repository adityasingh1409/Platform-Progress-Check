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
  leetcodeSolved: { type: Number, default: 0 },
  gfgSolved: { type: Number, default: 0 },
  hackerrankSolved: { type: Number, default: 0 },
  totalSolved: { type: Number, default: 0 }
}, { timestamps: true });

// Ensure unique entry per user per day
ProgressSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('Progress', ProgressSchema);
