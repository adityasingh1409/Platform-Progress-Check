# Student Coding Progress Tracker

A comprehensive full-stack MERN application for tracking student coding progress across multiple platforms (LeetCode, HackerRank, GeeksforGeeks).

## 🚀 Features

- **Role-Based Access Control**: Admin, Teacher, and Student roles with different permissions
- **Authentication**: JWT-based secure authentication
- **Progress Tracking**: Automatic web scraping from coding platforms
- **Analytics Dashboard**: Beautiful charts and statistics
- **Feedback System**: Teachers can send feedback to students
- **User Management**: Admin can approve users and assign teachers

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Web Scraping (Axios, Cheerio)
- Bcrypt for password hashing

### Frontend
- React 18
- React Router v6
- Chart.js for data visualization
- React Icons
- React Toastify for notifications
- Axios for API calls

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/adityasingh1409/Platform-Progress-Check.git
cd Platform-Progress-Check
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed admin user
npm run seed

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo REACT_APP_API_URL=http://localhost:5000/api > .env

# Start frontend
npm start
```

## 🔑 Default Credentials

### Admin
```
Email: admin@progresstracker.com
Password: admin123
```

### Test Teacher
```
Email: teacher@test.com
Password: teacher123
```

### Test Student
```
Email: student@test.com
Password: student123
```

⚠️ **Change these passwords in production!**

## 🌐 Usage

1. **Admin**: Login → Approve users → Assign teachers → View analytics
2. **Student**: Login → Add profile links → Sync progress → View dashboard
3. **Teacher**: Login → View assigned students → Send feedback → View analytics

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students/profile` - Get student profile
- `PUT /api/students/profile` - Update profile links
- `POST /api/students/sync-progress` - Sync progress from platforms
- `GET /api/students/progress` - Get student progress

### Teachers
- `GET /api/teachers/students` - Get assigned students
- `GET /api/teachers/analytics` - Get analytics
- `POST /api/teachers/feedback` - Send feedback

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/approve` - Approve user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/assign-teacher` - Assign teacher to students

## 🎨 Features Showcase

- ✅ Beautiful dark theme UI
- ✅ Responsive design
- ✅ Interactive charts and graphs
- ✅ Real-time progress tracking
- ✅ Automated data collection via web scraping
- ✅ Role-based dashboards
- ✅ Feedback management system

## 📁 Project Structure

```
Platform-Progress-Check/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── scrapers/        # Web scraping logic
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # React context
│       ├── pages/       # Page components
│       ├── services/    # API calls
│       └── App.jsx      # Main app component
│
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/progress-tracker
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend (Render/Heroku)
1. Create new web service
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Import GitHub repository
2. Set build command: `npm run build`
3. Set environment variable: `REACT_APP_API_URL`
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Get connection string
3. Update backend .env

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Aditya Singh**
- GitHub: [@adityasingh1409](https://github.com/adityasingh1409)

## 🙏 Acknowledgments

- LeetCode, HackerRank, and GeeksforGeeks for providing the platforms
- React and Node.js communities for excellent documentation

---

**Made with ❤️ for coding enthusiasts**
