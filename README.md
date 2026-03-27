# Coding Progress Tracker (MERN Stack)

A modern, full-stack application built for students and developers to track their daily coding problem-solving consistency across prominent platforms: LeetCode, GeeksForGeeks, and HackerRank.

## Features
- **Authentication**: JWT-based Login and Register.
- **Student Dashboard**: Visualized Coding stats using `Chart.js` (Doughnut charts) to see problems solved.
- **Profile Management**: Option to add/edit usernames for coding platforms.
- **Leaderboard**: Users are ranked according to their `consistencyScore` globally.
- **Data Fetching/Scraping**: 
   - Uses LeetCode GraphQL API for LeetCode Stats.
   - Uses Cheerio to scrape GeeksForGeeks.
   - Uses Axios to fetch HackerRank badges for approximation.

## Folder Structure

```
Progress Tracker/
├── backend/
│   ├── .env                       # Environment variables (Mongo URI, JWT Secret)
│   ├── package.json               # Backend dependencies
│   ├── server.js                  # Entry point for backend
│   ├── models/
│   │   ├── User.js                # Mongoose schema for User
│   │   └── Progress.js            # Mongoose schema for Daily Progress Tracking
│   ├── controllers/
│   │   ├── authController.js      # Login, Register, Profile handlers
│   │   └── statsController.js     # Progress Sync and Leaderboard logic
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth endpoints
│   │   └── statsRoutes.js         # /api/stats endpoints
│   ├── middleware/
│   │   └── authMiddleware.js      # Protects private routes via JWT
│   └── utils/
│       └── scrapers.js            # Logic for LeetCode GraphQL & Cheerio Scrapers
└── frontend/
    ├── package.json               # Frontend dependencies
    ├── postcss.config.js          # PostCSS Config for Tailwind
    ├── tailwind.config.js         # Tailwind settings (Custom colors added)
    ├── vite.config.js             # Vite settings
    ├── index.html                 # Main App HTML point
    └── src/
        ├── App.jsx                # React Router Setup (Login/Register/Dashboard/Profile/Leaderboard)
        ├── main.jsx               # React DOM Entry
        ├── index.css              # Custom global styles (Tailwind base, Custom Scrollbar)
        ├── components/
        │   └── Navbar.jsx         # Navigation menu (visible post-login)
        └── pages/
            ├── Login.jsx          # Login UI (Glassmorphic design)
            ├── Register.jsx       # Register UI
            ├── Dashboard.jsx      # Progress displaying and Sync action (Chart.js)
            ├── Profile.jsx        # Save Platform usernames
            └── Leaderboard.jsx    # Competitive Leaderboard UI
```

## Setup & Running Locally

1. **Backend setup**:
   Make sure MongoDB is installed locally. Modify the `MONGO_URI` in `backend/.env` if your instance is different. Then run:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend setup**:
   Open a new terminal and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Design Notes
The application features a modern dark-mode aesthetic. 
Technologies: **React, TailwindCSS, Vite, Node.js, Express, MongoDB**.
Colors used: `darkBg` (`#0f172a`), `primaryBlue` (`#3b82f6`), and `accentCyan` (`#06b6d4`). Displays smooth hover animations, gradients and glassmorphic translucent layers for a premium state-of-the-art view.
