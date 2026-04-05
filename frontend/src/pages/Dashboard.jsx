import { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [score, setScore] = useState(0);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/stats/sync', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.progress);
      setScore(res.data.consistencyScore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [
          (stats?.leetcodeEasy || 0) + (stats?.gfgEasy || 0) + (stats?.hackerrankEasy || 0),
          (stats?.leetcodeMedium || 0) + (stats?.gfgMedium || 0) + (stats?.hackerrankMedium || 0),
          (stats?.leetcodeHard || 0) + (stats?.gfgHard || 0) + (stats?.hackerrankHard || 0)
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryBlue to-accentCyan">
            Your Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Consistency Score: <span className="text-white font-bold">{score} 🔥</span></p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="group px-6 py-2 bg-gradient-to-r from-primaryBlue to-accentCyan text-white rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:-translate-y-0 flex items-center gap-2 active:scale-95"
        >
          {loading ? (
             <span className="animate-spin text-xl">↻</span>
          ) : (
             <>
               <span className="group-hover:rotate-180 transition-transform duration-500">↻</span>
               <span>Sync Daily Progress</span>
             </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[ 
          { name: 'Total Solved', val: stats?.totalSolved || 0, color: 'text-white' },
          { name: 'Easy', val: (stats?.leetcodeEasy || 0) + (stats?.gfgEasy || 0) + (stats?.hackerrankEasy || 0), color: 'text-green-400' },
          { name: 'Medium', val: (stats?.leetcodeMedium || 0) + (stats?.gfgMedium || 0) + (stats?.hackerrankMedium || 0), color: 'text-orange-400' },
          { name: 'Hard', val: (stats?.leetcodeHard || 0) + (stats?.gfgHard || 0) + (stats?.hackerrankHard || 0), color: 'text-red-500' }
        ].map((diff) => (
          <div key={diff.name} className="group bg-darkCard/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-xl hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(34,211,238,0.2)] flex flex-col justify-center items-center cursor-default">
            <h3 className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-2">{diff.name}</h3>
            <p className={`text-4xl font-extrabold transition-transform duration-300 group-hover:scale-110 \${diff.color}`}>
              {diff.val}
            </p>
          </div>
        ))}
      </div>

      {stats?.totalSolved > 0 ? (
        <div className="group bg-darkCard/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] transition-all duration-500 hover:-translate-y-1 max-w-lg mx-auto flex flex-col items-center">
          <h2 className="text-xl font-bold text-white mb-6 group-hover:text-accentCyan transition-colors duration-300">Problems Distribution</h2>
          <div className="w-64 h-64 transition-transform duration-500 group-hover:scale-105">
             <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      ) : (
        <div className="text-center p-10 border border-dashed border-gray-700 rounded-2xl text-gray-500 bg-darkCard/50">
           <p className="text-lg mb-2">No stats available yet.</p>
           <p className="text-sm">Click "Sync Daily Progress" to update or Make sure you've added your usernames in the Profile tab.</p>
        </div>
      )}
    </div>
  );
}
