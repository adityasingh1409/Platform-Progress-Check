import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaUsers, FaUserCheck, FaUserTimes, FaChartBar } from 'react-icons/fa';
import './StudentDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            const params = {};
            if (filter !== 'all') {
                if (filter === 'pending') {
                    params.isApproved = 'false';
                } else {
                    params.role = filter;
                }
            }

            const [usersRes, analyticsRes] = await Promise.all([
                adminAPI.getAllUsers(params),
                adminAPI.getAnalytics()
            ]);

            setUsers(usersRes.data.users);
            setAnalytics(analyticsRes.data.analytics);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await adminAPI.approveUser(userId);
            toast.success('User approved successfully!');
            loadData();
        } catch (error) {
            toast.error('Failed to approve user');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await adminAPI.deleteUser(userId);
            toast.success('User deleted successfully!');
            loadData();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    if (loading) {
        return <div className="dashboard-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <p className="dashboard-subtitle">Manage users and system analytics</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                        <FaUsers />
                    </div>
                    <div className="stat-content">
                        <h3>{analytics?.users?.total || 0}</h3>
                        <p>Total Users</p>
                    </div>
                </div>

                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>
                        <FaUserCheck />
                    </div>
                    <div className="stat-content">
                        <h3>{analytics?.users?.students || 0}</h3>
                        <p>Students</p>
                    </div>
                </div>

                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>
                        <FaChartBar />
                    </div>
                    <div className="stat-content">
                        <h3>{analytics?.users?.teachers || 0}</h3>
                        <p>Teachers</p>
                    </div>
                </div>

                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                        <FaUserTimes />
                    </div>
                    <div className="stat-content">
                        <h3>{analytics?.users?.pendingApprovals || 0}</h3>
                        <p>Pending Approvals</p>
                    </div>
                </div>
            </div>

            <div className="card mt-lg">
                <div className="flex justify-between items-center mb-md">
                    <h3>User Management</h3>
                    <select
                        className="input"
                        style={{ width: 'auto' }}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Users</option>
                        <option value="student">Students</option>
                        <option value="teacher">Teachers</option>
                        <option value="pending">Pending Approval</option>
                    </select>
                </div>

                <div className="platform-list">
                    {users.length === 0 ? (
                        <p className="text-muted text-center">No users found</p>
                    ) : (
                        users.map((user) => (
                            <div key={user._id} className="platform-item">
                                <div className="platform-header">
                                    <div>
                                        <div className="font-semibold">{user.name}</div>
                                        <div className="text-sm text-secondary">{user.email}</div>
                                        {user.batch && (
                                            <div className="text-sm text-muted">Batch: {user.batch}</div>
                                        )}
                                    </div>
                                    <div className="flex gap-sm items-center">
                                        <span className={`badge ${user.role === 'admin' ? 'badge-danger' : user.role === 'teacher' ? 'badge-info' : 'badge-primary'}`}>
                                            {user.role}
                                        </span>
                                        {!user.isApproved && (
                                            <span className="badge badge-warning">Pending</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-sm mt-sm">
                                    {!user.isApproved && user.role !== 'admin' && (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleApprove(user._id)}
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {user.role !== 'admin' && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {analytics?.batches && analytics.batches.length > 0 && (
                <div className="card mt-lg">
                    <h3 className="mb-md">Batch Statistics</h3>
                    <div className="grid grid-3">
                        {analytics.batches.map((batch) => (
                            <div key={batch._id} className="card-glass p-lg">
                                <h4 className="text-primary">{batch._id}</h4>
                                <div className="mt-sm">
                                    <div className="text-sm text-secondary">Total: {batch.count}</div>
                                    <div className="text-sm text-secondary">Approved: {batch.approved}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
