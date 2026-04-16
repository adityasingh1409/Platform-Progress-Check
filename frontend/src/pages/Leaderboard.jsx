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
      <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brandPrimary to-brandAccent mb-2 text-center">
        Global Leaderboard
      </h1>
      <p className="text-gray-400 text-center mb-10">Top users globally.</p>
      
      <div className="bg-darkCard/80 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl overflow-hidden hover:shadow-[0_10px_30px_-10px_rgba(44,187,93,0.2)] transition-all duration-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">Username</th>
              <th className="px-6 py-4 text-right font-medium">Total Solved</th>
              <th className="px-6 py-4 text-right font-medium">Consistency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 hidden md:table-row-group" style={{display: 'table-row-group'}}>
            {users.map((u, i) => (
              <tr key={u._id} className="group hover:bg-gray-800/40 hover:scale-[1.01] transition-all duration-300 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">
                  {i === 0 ? <span className="text-2xl drop-shadow-md">🥇</span> : 
                   i === 1 ? <span className="text-2xl drop-shadow-md">🥈</span> : 
                   i === 2 ? <span className="text-2xl drop-shadow-md">🥉</span> : 
                   <span className="text-gray-500 font-bold px-2 group-hover:text-white transition-colors">{i + 1}</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-white font-medium group-hover:text-brandAccent transition-colors duration-300">
                  {u.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-400 group-hover:text-green-300 transition-colors">
                  {u.totalProblemCount || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-brandAccent group-hover:shadow-[0_0_10px_rgba(255,161,22,0.5)] group-hover:text-white transition-all rounded-md">
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
