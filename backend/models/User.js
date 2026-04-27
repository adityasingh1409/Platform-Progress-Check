import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  githubUsername: { type: String, default: '' },
  leetcodeUsername: { type: String, default: '' },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
