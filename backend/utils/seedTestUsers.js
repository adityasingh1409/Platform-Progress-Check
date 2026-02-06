const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const createTestUsers = async () => {
    try {
        await connectDB();

        // Check if users already exist
        const existingStudent = await User.findOne({ email: 'student@test.com' });
        const existingTeacher = await User.findOne({ email: 'teacher@test.com' });

        // Create Student
        if (!existingStudent) {
            const student = await User.create({
                name: 'Test Student',
                email: 'student@test.com',
                password: 'student123',
                role: 'student',
                batch: '2024-CS-A',
                isApproved: true // Pre-approved for testing
            });
            console.log('✅ Test Student created');
            console.log('   Email: student@test.com');
            console.log('   Password: student123');
        } else {
            console.log('ℹ️  Test Student already exists');
        }

        // Create Teacher
        if (!existingTeacher) {
            const teacher = await User.create({
                name: 'Test Teacher',
                email: 'teacher@test.com',
                password: 'teacher123',
                role: 'teacher',
                batch: '2024-CS-A',
                isApproved: true // Pre-approved for testing
            });
            console.log('✅ Test Teacher created');
            console.log('   Email: teacher@test.com');
            console.log('   Password: teacher123');
        } else {
            console.log('ℹ️  Test Teacher already exists');
        }

        console.log('\n📋 All Test Accounts:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👨‍💼 Admin:');
        console.log('   Email: admin@progresstracker.com');
        console.log('   Password: admin123');
        console.log('');
        console.log('👨‍🏫 Teacher:');
        console.log('   Email: teacher@test.com');
        console.log('   Password: teacher123');
        console.log('');
        console.log('🎓 Student:');
        console.log('   Email: student@test.com');
        console.log('   Password: student123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test users:', error);
        process.exit(1);
    }
};

createTestUsers();
