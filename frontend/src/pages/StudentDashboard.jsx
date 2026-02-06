import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaCode, FaSync, FaTrophy, FaFire } from 'react-icons/fa';
import { SiGeeksforgeeks, SiHackerrank, SiLeetcode } from 'react-icons/si';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import './StudentDashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const StudentDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [profileData, setProfileData] = useState({
        leetcodeUrl: '',
        hackerrankUrl: '',
        geeksforgeeksUrl: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [profileRes, progressRes] = await Promise.all([
                studentAPI.getProfile(),
                studentAPI.getProgress()
            ]);

            setProfile(profileRes.data.profile);
            setProgress(progressRes.data.progress);

            if (profileRes.data.profile) {
                setProfileData({
                    leetcodeUrl: profileRes.data.profile.leetcodeUrl || '',
                    hackerrankUrl: profileRes.data.profile.hackerrankUrl || '',
                    geeksforgeeksUrl: profileRes.data.profile.geeksforgeeksUrl || ''
                });
            }
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await studentAPI.updateProfile(profileData);
            toast.success('Profile updated successfully!');
            setShowProfileForm(false);
            loadData();
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const response = await studentAPI.syncProgress();
            toast.success('Progress synced successfully!');
            loadData();
        } catch (error) {
            toast.error('Failed to sync progress');
        } finally {
            setSyncing(false);
        }
    };

    const getTotalStats = () => {
        return progress.reduce((acc, p) => ({
            total: acc.total + p.totalSolved,
            easy: acc.easy + p.easySolved,
            medium: acc.medium + p.mediumSolved,
            hard: acc.hard + p.hardSolved
        }), { total: 0, easy: 0, medium: 0, hard: 0 });
    };

    const stats = getTotalStats();

    const difficultyData = {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{
            data: [stats.easy, stats.medium, stats.hard],
            backgroundColor: [
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderColor: [
                'rgba(16, 185, 129, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 2
        }]
    };

    const platformIcons = {
        leetcode: <SiLeetcode size={24} />,
        hackerrank: <SiHackerrank size={24} />,
        geeksforgeeks: <SiGeeksforgeeks size={24} />
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Student Dashboard</h1>
                    <p className="dashboard-subtitle">Track your coding progress across platforms</p>
                </div>
                <div className="dashboard-actions">
                    <button
                        className="btn btn-outline"
                        onClick={() => setShowProfileForm(!showProfileForm)}
                    >
                        <FaCode /> {profile?.leetcodeUrl || profile?.hackerrankUrl || profile?.geeksforgeeksUrl ? 'Update' : 'Add'} Profiles
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSync}
                        disabled={syncing || !profile?.leetcodeUrl && !profile?.hackerrankUrl && !profile?.geeksforgeeksUrl}
                    >
                        <FaSync className={syncing ? 'animate-pulse' : ''} />
                        {syncing ? 'Syncing...' : 'Sync Progress'}
                    </button>
                </div>
            </div>

            {showProfileForm && (
                <div className="card animate-fadeIn mb-lg">
                    <h3 className="mb-md">Update Profile Links</h3>
                    <form onSubmit={handleProfileUpdate} className="profile-form">
                        <div className="form-group">
                            <label><SiLeetcode /> LeetCode Profile URL</label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://leetcode.com/username"
                                value={profileData.leetcodeUrl}
                                onChange={(e) => setProfileData({ ...profileData, leetcodeUrl: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label><SiHackerrank /> HackerRank Profile URL</label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://hackerrank.com/username"
                                value={profileData.hackerrankUrl}
                                onChange={(e) => setProfileData({ ...profileData, hackerrankUrl: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label><SiGeeksforgeeks /> GeeksforGeeks Profile URL</label>
                            <input
                                type="url"
                                className="input"
                                placeholder="https://auth.geeksforgeeks.org/user/username"
                                value={profileData.geeksforgeeksUrl}
                                onChange={(e) => setProfileData({ ...profileData, geeksforgeeksUrl: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Profile</button>
                    </form>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                        <FaTrophy />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.total}</h3>
                        <p>Total Problems Solved</p>
                    </div>
                </div>

                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>
                        <FaCode />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.easy}</h3>
                        <p>Easy Problems</p>
                    </div>
                </div>

                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <FaFire />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.medium}</h3>
                        <p>Medium Problems</p>
                    </div>
                </div>

                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                        <FaTrophy />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.hard}</h3>
                        <p>Hard Problems</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-2 mt-lg">
                <div className="card">
                    <h3 className="mb-md">Difficulty Distribution</h3>
                    <div className="chart-container">
                        <Doughnut data={difficultyData} options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: 'var(--text-primary)'
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>

                <div className="card">
                    <h3 className="mb-md">Platform-wise Progress</h3>
                    <div className="platform-list">
                        {progress.length === 0 ? (
                            <p className="text-muted text-center">No progress data yet. Add your profile links and sync!</p>
                        ) : (
                            progress.map((p) => (
                                <div key={p.platform} className="platform-item">
                                    <div className="platform-header">
                                        <div className="flex items-center gap-sm">
                                            {platformIcons[p.platform]}
                                            <span className="font-semibold capitalize">{p.platform}</span>
                                        </div>
                                        <span className="badge badge-primary">{p.totalSolved} solved</span>
                                    </div>
                                    <div className="platform-stats">
                                        <div className="platform-stat">
                                            <span className="badge badge-success">{p.easySolved} Easy</span>
                                        </div>
                                        <div className="platform-stat">
                                            <span className="badge badge-warning">{p.mediumSolved} Medium</span>
                                        </div>
                                        <div className="platform-stat">
                                            <span className="badge badge-danger">{p.hardSolved} Hard</span>
                                        </div>
                                    </div>
                                    {p.ranking && (
                                        <div className="mt-sm text-sm text-secondary">
                                            Ranking: #{p.ranking}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
