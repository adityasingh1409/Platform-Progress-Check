import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [platforms, setPlatforms] = useState({
    leetcode: '',
    gfg: '',
    hackerrank: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer \${token}` }
        });
        setPlatforms({
          leetcode: res.data.platforms?.leetcode || '',
          gfg: res.data.platforms?.gfg || '',
          hackerrank: res.data.platforms?.hackerrank || ''
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
        headers: { Authorization: `Bearer \${token}` }
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      
      const user = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...user, platforms: res.data.platforms }));
    } catch (err) {
      setError('Update failed.');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="flex justify-center mt-16 px-4">
      <div className="bg-darkCard p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-800">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryBlue to-accentCyan mb-6 text-center">
          Update Profile
        </h2>
        
        {message && <div className="p-3 mb-4 text-sm text-green-400 bg-green-400/10 border border-green-500/20 rounded-md text-center">{message}</div>}
        {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-400/10 border border-red-500/20 rounded-md text-center">{error}</div>}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">LeetCode Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none transition-all placeholder-gray-600 text-white"
              placeholder="e.g. aditya123"
              value={platforms.leetcode}
              onChange={(e) => setPlatforms({ ...platforms, leetcode: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">GeeksForGeeks Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none transition-all placeholder-gray-600 text-white"
              placeholder="e.g. dev_coder"
              value={platforms.gfg}
              onChange={(e) => setPlatforms({ ...platforms, gfg: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">HackerRank Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent outline-none transition-all placeholder-gray-600 text-white"
              placeholder="e.g. hack_master"
              value={platforms.hackerrank}
              onChange={(e) => setPlatforms({ ...platforms, hackerrank: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primaryBlue to-accentCyan hover:from-blue-600 hover:to-cyan-500 transition-all transform hover:-translate-y-1"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
