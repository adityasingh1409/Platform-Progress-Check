import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Profile() {
  const [platforms, setPlatforms] = useState({
    leetcodeUsername: '',
    githubUsername: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlatforms({
          leetcodeUsername: res.data.leetcodeUsername || '',
          githubUsername: res.data.githubUsername || '',
        });
      } catch (err) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/auth/platforms', platforms, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Usernames updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      const userStr = localStorage.getItem('user');
      const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : {};
      localStorage.setItem('user', JSON.stringify({ ...user, githubUsername: res.data.githubUsername, leetcodeUsername: res.data.leetcodeUsername }));
    } catch (err) {
      console.error('Update platforms error:', err);
      setError(err.response?.data?.message || err.message || 'Update failed.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <div className="text-gray-900 text-center mt-20">Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      <div className="bg-lightCard/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 hover:shadow-[0_10px_40px_-10px_rgba(44,187,93,0.2)] transition-all duration-300 transform">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brandPrimary to-brandAccent mb-6 text-center transition-all duration-300 hover:scale-105 hover:tracking-wide">
          Update Profile
        </h2>
        
        {message && <div className="p-3 mb-4 text-sm text-green-400 bg-green-400/10 border border-green-500/20 rounded-md text-center">{message}</div>}
        {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-400/10 border border-red-500/20 rounded-md text-center">{error}</div>}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-1 group-focus-within:text-brandAccent transition-colors">GitHub Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none transition-all duration-300 placeholder-gray-600 text-gray-900 hover:border-gray-500 focus:-translate-y-1 focus:shadow-[0_10px_20px_-10px_rgba(44,187,93,0.3)]"
              placeholder="e.g. dev_ninja"
              value={platforms.githubUsername}
              onChange={(e) => setPlatforms({ ...platforms, githubUsername: e.target.value })}
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-1 group-focus-within:text-brandAccent transition-colors">LeetCode Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none transition-all duration-300 placeholder-gray-600 text-gray-900 hover:border-gray-500 focus:-translate-y-1 focus:shadow-[0_10px_20px_-10px_rgba(44,187,93,0.3)]"
              placeholder="e.g. dev_ninja"
              value={platforms.leetcodeUsername}
              onChange={(e) => setPlatforms({ ...platforms, leetcodeUsername: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg shadow-lg text-sm font-medium text-gray-900 bg-gradient-to-r from-brandPrimary to-brandAccent hover:from-green-600 hover:to-orange-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,161,22,0.4)] active:scale-95"
          >
            Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
}
