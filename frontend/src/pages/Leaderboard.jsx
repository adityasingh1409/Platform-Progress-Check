import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/stats/leaderboard');
        setUsers(res.data.leaderboard);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primaryBlue to-accentCyan mb-2 text-center">
        Global Leaderboard
      </h1>
      <p className="text-gray-400 text-center mb-10">Top users globally.</p>
      
      <div className="bg-darkCard rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">Username</th>
              <th className="px-6 py-4 text-right font-medium">Total Solved</th>
              <th className="px-6 py-4 text-right font-medium">Consistency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((u, i) => (
              <tr key={u._id} className="hover:bg-gray-800/20 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {i === 0 ? <span className="text-2xl">🥇</span> : 
                   i === 1 ? <span className="text-2xl">🥈</span> : 
                   i === 2 ? <span className="text-2xl">🥉</span> : 
                   <span className="text-gray-500 font-bold px-2">{i + 1}</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                  {u.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-400">
                  {u.totalProblemCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-accentCyan">
                  {u.consistencyScore}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No users found. Be the first to synchronize your stats!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
