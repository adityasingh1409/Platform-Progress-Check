import React, { useState, useEffect } from 'react';
import { teacherAPI, studentAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaUsers, FaChartLine, FaComments } from 'react-icons/fa';
import './StudentDashboard.css';

const TeacherDashboard = () => {
    const [students, setStudents] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [studentsRes, analyticsRes] = await Promise.all([
                teacherAPI.getAssignedStudents(),
                teacherAPI.getAnalytics()
            ]);

            setStudents(studentsRes.data.students);
            setAnalytics(analyticsRes.data.analytics);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSendFeedback = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !feedbackText.trim()) return;

        try {
            await teacherAPI.addFeedback({
                studentId: selectedStudent,
                message: feedbackText,
                category: 'suggestion'
            });
            toast.success('Feedback sent successfully!');
            setFeedbackText('');
            setSelectedStudent(null);
        } catch (error) {
            toast.error('Failed to send feedback');
        }
    };

    if (loading) {
        return <div className="dashboard-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Teacher Dashboard</h1>
                    <p className="dashboard-subtitle">Monitor and guide your students</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                        <FaUsers />
                    </div>
                    <div className="stat-content">
                        <h3>{analytics?.totalStudents || 0}</h3>
                        <p>Total Students</p>
                    </div>
                </div>

                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}>
                        <FaChartLine />
                    </div>
                    <div className="stat-content">
                        <h3>{analytics?.averageProgress?.totalSolved || 0}</h3>
                        <p>Avg Problems Solved</p>
                    </div>
                </div>

                <div className="stat-card card-glass">
                    <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>
                        <FaComments />
                    </div>
                    <div className="stat-content">
                        <h3>{Object.keys(analytics?.platforms || {}).length}</h3>
                        <p>Active Platforms</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-2 mt-lg">
                <div className="card">
                    <h3 className="mb-md">Assigned Students</h3>
                    <div className="platform-list">
                        {students.length === 0 ? (
                            <p className="text-muted text-center">No students assigned yet</p>
                        ) : (
                            students.map((student) => (
                                <div key={student._id} className="platform-item">
                                    <div className="platform-header">
                                        <div>
                                            <div className="font-semibold">{student.name}</div>
                                            <div className="text-sm text-secondary">{student.email}</div>
                                        </div>
                                        {student.batch && (
                                            <span className="badge badge-primary">{student.batch}</span>
                                        )}
                                    </div>
                                    <button
                                        className="btn btn-outline btn-sm mt-sm"
                                        onClick={() => setSelectedStudent(student._id)}
                                    >
                                        Send Feedback
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="card">
                    <h3 className="mb-md">Send Feedback</h3>
                    {selectedStudent ? (
                        <form onSubmit={handleSendFeedback} className="profile-form">
                            <div className="form-group">
                                <label>Student</label>
                                <select
                                    className="input"
                                    value={selectedStudent}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                >
                                    <option value="">Select a student</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    className="input"
                                    rows="5"
                                    placeholder="Enter your feedback..."
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Send Feedback</button>
                        </form>
                    ) : (
                        <p className="text-muted text-center">Select a student to send feedback</p>
                    )}
                </div>
            </div>

            {analytics?.topPerformers && analytics.topPerformers.length > 0 && (
                <div className="card mt-lg">
                    <h3 className="mb-md">Top Performers</h3>
                    <div className="platform-list">
                        {analytics.topPerformers.slice(0, 5).map((performer, index) => (
                            <div key={performer.student._id} className="platform-item">
                                <div className="platform-header">
                                    <div className="flex items-center gap-md">
                                        <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <div className="font-semibold">{performer.student.name}</div>
                                            <div className="text-sm text-secondary">{performer.student.batch}</div>
                                        </div>
                                    </div>
                                    <span className="badge badge-success">{performer.totalSolved} problems</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
