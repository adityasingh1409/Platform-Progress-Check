import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me')
};

// Student API
export const studentAPI = {
    getProfile: () => api.get('/students/profile'),
    updateProfile: (data) => api.put('/students/profile', data),
    syncProgress: () => api.post('/students/sync-progress'),
    getProgress: () => api.get('/students/progress'),
    getAllStudents: () => api.get('/students'),
    getStudentProgress: (id) => api.get(`/students/${id}/progress`)
};

// Teacher API
export const teacherAPI = {
    getAssignedStudents: () => api.get('/teachers/students'),
    getAnalytics: (params) => api.get('/teachers/analytics', { params }),
    addFeedback: (data) => api.post('/teachers/feedback', data),
    getFeedback: () => api.get('/teachers/feedback'),
    getMyFeedback: () => api.get('/teachers/my-feedback')
};

// Admin API
export const adminAPI = {
    getAllUsers: (params) => api.get('/admin/users', { params }),
    approveUser: (id) => api.put(`/admin/users/${id}/approve`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    assignTeacher: (data) => api.post('/admin/assign-teacher', data),
    getAnalytics: () => api.get('/admin/analytics')
};

export default api;
