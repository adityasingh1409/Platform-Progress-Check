const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        enum: ['leetcode', 'hackerrank', 'geeksforgeeks'],
        required: true
    },
    totalSolved: {
        type: Number,
        default: 0
    },
    easySolved: {
        type: Number,
        default: 0
    },
    mediumSolved: {
        type: Number,
        default: 0
    },
    hardSolved: {
        type: Number,
        default: 0
    },
    ranking: {
        type: Number,
        default: null
    },
    streak: {
        type: Number,
        default: 0
    },
    acceptanceRate: {
        type: Number,
        default: 0
    },
    reputation: {
        type: Number,
        default: 0
    },
    badges: [{
        name: String,
        count: Number
    }],
    recentSubmissions: [{
        title: String,
        difficulty: String,
        timestamp: Date,
        status: String
    }],
    lastScraped: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
progressSchema.index({ user: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
