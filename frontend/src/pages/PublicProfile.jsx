import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { GitHubCalendar } from 'react-github-calendar';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PublicProfile() {
  const { username } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/stats/user/${username}/public`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch public profile.');
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username]);

  const stats = data?.stats?.progress;
  const targetUser = data?.user;

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
          'rgba(46, 200, 102, 0.8)',
          'rgba(255, 172, 28, 0.8)',
          'rgba(239, 68, 68, 0.8)'
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

  if (loading) return <div className="text-white text-center mt-20">Loading public profile...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {error ? (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-center">
              {error}
          </div>
      ) : targetUser && stats ? (
        <>
          <div className="flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-brandPrimary to-brandAccent rounded-full flex items-center justify-center text-4xl text-white font-bold mb-4 shadow-[0_0_20px_rgba(44,187,93,0.4)]">
                {targetUser.username.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {targetUser.username}
              </h1>
              <p className="text-brandAccent mt-2 font-medium text-lg text-center">Current Streak: <span className="font-bold text-white">{stats.streak || 0} 🔥</span></p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[ 
              { name: 'Total Solved', val: stats.totalSolved || 0, color: 'text-white' },
              { name: 'LeetCode Easy', val: stats.lcEasy || 0, color: 'text-green-400' },
              { name: 'LeetCode Medium', val: stats.lcMedium || 0, color: 'text-orange-400' },
              { name: 'GitHub Commits', val: stats.githubCommits || 0, color: 'text-brandAccent' }
            ].map((diff) => (
              <div key={diff.name} className="group bg-darkCard/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-xl flex flex-col justify-center items-center">
                <h3 className="text-gray-400 text-xs sm:text-sm font-semibold uppercase mb-2">{diff.name}</h3>
                <p className={`text-4xl font-extrabold ${diff.color}`}>
                  {diff.val}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LeetCode Ring */}
              <div className="bg-darkCard/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl flex flex-col items-center">
                  <h2 className="text-xl font-bold text-white mb-6">Problems Distribution</h2>
                  <div className="w-64 h-64">
                    <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                  </div>
              </div>

              {/* Recent Commits */}
              <div className="bg-darkCard/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-4">Recent Commits</h2>
                  <div className="space-y-4 overflow-y-auto max-h-64 pr-2">
                      {data.stats.recentCommits && data.stats.recentCommits.length > 0 ? (
                          data.stats.recentCommits.map((c, i) => (
                              <div key={i} className="border-l-2 border-brandPrimary pl-4">
                                  <p className="text-white text-sm font-medium">{c.message}</p>
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
          {targetUser.githubUsername && (
              <div className="bg-darkCard/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl">
                  <h2 className="text-xl font-bold text-white mb-6">GitHub Contributions</h2>
                  <div className="flex justify-center overflow-x-auto text-white">
                      <GitHubCalendar username={targetUser.githubUsername} colorScheme="dark" />
                  </div>
              </div>
          )}
        </>
      ) : null}
    </div>
  );
}
