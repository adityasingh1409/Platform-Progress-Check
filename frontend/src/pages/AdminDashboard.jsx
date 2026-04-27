import { useState, useEffect } from 'react';
import axios from 'axios';

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

  if (loading) return <div className="text-white text-center mt-10 text-xl font-bold">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      <div className="bg-darkCard rounded-xl p-6 shadow-2xl border border-gray-800">
        <h2 className="text-xl font-bold text-brandAccent mb-6">All Users ({users.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
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
                <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="p-3 font-medium text-white">{u.username}</td>
                  <td className="p-3 text-gray-300">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-brandPrimary/20 text-brandPrimary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">{u.githubUsername || '-'}</td>
                  <td className="p-3 text-gray-400">{u.leetcodeUsername || '-'}</td>
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
    </div>
  );
}

export default AdminDashboard;
