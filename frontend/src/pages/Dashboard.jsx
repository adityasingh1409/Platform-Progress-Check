import { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { GitHubCalendar } from 'react-github-calendar';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const fetchStats = async (forceSync = false) => {
    if (forceSync) setSyncing(true);
    else setLoading(true);
    
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const endpoint = forceSync ? 'http://localhost:5000/api/stats/sync' : 'http://localhost:5000/api/stats/me';
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch stats. Please try again later.');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = data?.progress;
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;

  const chartData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [
          stats?.lcEasy || 0,
          stats?.lcMedium || 0,
          stats?.lcHard || 0
        ],
        backgroundColor: [
          'rgba(46, 200, 102, 0.8)', // Easy Green
          'rgba(255, 172, 28, 0.8)', // Medium Orange
          'rgba(239, 68, 68, 0.8)'   // Hard Red
        ],
        borderColor: [
          'rgba(46, 200, 102, 1)',
          'rgba(255, 172, 28, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div className="text-gray-900 text-center mt-20">Loading Dashboard...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brandPrimary to-brandAccent">
            Your Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Current Streak: <span className="text-gray-900 font-bold">{stats?.streak || 0} 🔥</span></p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={syncing}
          className={`px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-brandPrimary to-brandAccent shadow-md hover:shadow-lg transition-all duration-300 ${syncing ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
        >
          {syncing ? 'Syncing...' : 'Sync Data'}
        </button>
      </div>

      {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
          </div>
      )}

      {!user?.githubUsername && !user?.leetcodeUsername && (
          <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-center">
              Please set your GitHub and LeetCode usernames in your Profile!
          </div>
      )}

      {stats ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[ 
              { name: 'Total LeetCode', val: (stats.lcEasy || 0) + (stats.lcMedium || 0) + (stats.lcHard || 0), color: 'text-gray-900' },
              { name: 'LC Easy', val: stats.lcEasy || 0, color: 'text-green-600' },
              { name: 'LC Medium', val: stats.lcMedium || 0, color: 'text-orange-500' },
              { name: 'LC Hard', val: stats.lcHard || 0, color: 'text-red-500' },
              { name: 'GitHub Commits', val: stats.githubCommits || 0, color: 'text-brandAccent' },
              { name: 'Total Activity', val: stats.totalSolved || 0, color: 'text-brandPrimary' }
            ].map((diff) => (
              <div key={diff.name} className="group bg-lightCard/80 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-xl flex flex-col justify-center items-center">
                <h3 className="text-gray-600 group-hover:text-gray-800 transition-colors text-xs sm:text-sm font-semibold uppercase mb-2">{diff.name}</h3>
                <p className={`text-4xl font-extrabold ${diff.color}`}>
                  {diff.val}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LeetCode Ring */}
              <div className="bg-lightCard/80 backdrop-blur-md p-8 rounded-2xl border border-gray-200 shadow-xl flex flex-col items-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Problems Distribution</h2>
                  <div className="w-64 h-64">
                    <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                  </div>
              </div>

              {/* Recent Commits */}
              <div className="bg-lightCard/80 backdrop-blur-md p-8 rounded-2xl border border-gray-200 shadow-xl flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Commits</h2>
                  <div className="space-y-4 overflow-y-auto max-h-64 pr-2">
                      {data.recentCommits && data.recentCommits.length > 0 ? (
                          data.recentCommits.map((c, i) => (
                              <div key={i} className="border-l-2 border-brandPrimary pl-4">
                                  <p className="text-gray-900 text-sm font-medium">{c.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{c.repo} • {new Date(c.date).toLocaleDateString()}</p>
                              </div>
                          ))
                      ) : (
                          <p className="text-gray-500 text-sm">No recent GitHub activity found.</p>
                      )}
                  </div>
              </div>
          </div>

          {/* GitHub Heatmap */}
          {user?.githubUsername && (
              <div className="bg-lightCard/80 backdrop-blur-md p-8 rounded-2xl border border-gray-200 shadow-xl">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">GitHub Contributions</h2>
                  <div className="flex justify-center overflow-x-auto text-gray-900">
                      <GitHubCalendar username={user.githubUsername} colorScheme="light" />
                  </div>
              </div>
          )}
        </>
      ) : null}
    </motion.div>
  );
}
