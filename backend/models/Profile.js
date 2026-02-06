const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    leetcodeUrl: {
        type: String,
        default: null,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return /^https?:\/\/(www\.)?leetcode\.com\//.test(v);
            },
            message: 'Please provide a valid LeetCode URL'
        }
    },
    hackerrankUrl: {
        type: String,
        default: null,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return /^https?:\/\/(www\.)?hackerrank\.com\//.test(v);
            },
            message: 'Please provide a valid HackerRank URL'
        }
    },
    geeksforgeeksUrl: {
        type: String,
        default: null,
        validate: {
            validator: function (v) {
                if (!v) return true;
                return /^https?:\/\/(www\.)?auth\.geeksforgeeks\.org\/user\//.test(v) ||
                    /^https?:\/\/(www\.)?geeksforgeeks\.org\/user\//.test(v);
            },
            message: 'Please provide a valid GeeksForGeeks URL'
        }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
