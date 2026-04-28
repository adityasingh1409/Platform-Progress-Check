import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import PublicProfile from './pages/PublicProfile';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === 'admin';

  return (
    <Router>
      <div className="min-h-screen bg-lightBg flex flex-col">
        {isAuthenticated && <Navbar />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? (isAdmin ? <Navigate to="/admin" /> : <Dashboard />) : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated && !isAdmin ? <Profile /> : <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            <Route path="/leaderboard" element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />} />
            <Route path="/admin" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            <Route path="/u/:username" element={<PublicProfile />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
