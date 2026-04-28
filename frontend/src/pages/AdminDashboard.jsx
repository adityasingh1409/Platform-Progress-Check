import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-gray-900 text-center mt-10 text-xl font-bold">Loading...</div>;

  const totalUsers = users.length;
  const totalSolvedAcrossPlatform = users.reduce((acc, u) => acc + (u.stats?.totalSolved || 0), 0);
  let mostActiveUser = 'N/A';
  let maxSolved = -1;
  users.forEach(u => {
    if (u.stats?.totalSolved > maxSolved) {
      maxSolved = u.stats.totalSolved;
      mostActiveUser = u.username;
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-lightCard rounded-xl p-6 shadow-xl border border-gray-200 flex flex-col items-center justify-center">
          <h3 className="text-gray-500 font-semibold uppercase text-sm mb-2">Total Users</h3>
          <p className="text-4xl font-extrabold text-brandPrimary">{totalUsers}</p>
        </div>
        <div className="bg-lightCard rounded-xl p-6 shadow-xl border border-gray-200 flex flex-col items-center justify-center">
          <h3 className="text-gray-500 font-semibold uppercase text-sm mb-2">Platform Total Solved</h3>
          <p className="text-4xl font-extrabold text-brandAccent">{totalSolvedAcrossPlatform}</p>
        </div>
        <div className="bg-lightCard rounded-xl p-6 shadow-xl border border-gray-200 flex flex-col items-center justify-center">
          <h3 className="text-gray-500 font-semibold uppercase text-sm mb-2">Most Active User</h3>
          <p className="text-2xl font-extrabold text-gray-900 truncate w-full text-center">{mostActiveUser}</p>
        </div>
      </div>

      <div className="bg-lightCard rounded-xl p-6 shadow-2xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">All Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-gray-600">
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">GitHub</th>
                <th className="p-3">LeetCode</th>
                <th className="p-3">Total Solved</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                  <td className="p-3 font-medium text-gray-900">{u.username}</td>
                  <td className="p-3 text-gray-700">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-brandPrimary/20 text-brandPrimary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">{u.githubUsername || '-'}</td>
                  <td className="p-3 text-gray-600">{u.leetcodeUsername || '-'}</td>
                  <td className="p-3 font-bold text-brandAccent">{u.stats?.totalSolved || 0}</td>
                  <td className="p-3">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleDelete(u._id)}
                        className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;
