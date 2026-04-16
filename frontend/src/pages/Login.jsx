import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-darkBg text-white px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-brandPrimary/10 to-brandAccent/5 pointer-events-none" />
      <div className="w-full max-w-md p-8 space-y-8 bg-darkCard/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800 z-10 transition-all duration-300 hover:shadow-brandPrimary/10 hover:-translate-y-1">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brandPrimary to-brandAccent mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-400">Log in to track your coding progress.</p>
        </div>
        
        {error && <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-500/20 rounded-md text-center">{error}</div>}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-1 group-focus-within:text-brandAccent transition-colors">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none transition-all duration-300 placeholder-gray-500 text-white hover:border-gray-500 focus:-translate-y-1 focus:shadow-[0_10px_20px_-10px_rgba(44,187,93,0.3)]"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-1 group-focus-within:text-brandAccent transition-colors">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none transition-all duration-300 placeholder-gray-500 text-white hover:border-gray-500 focus:-translate-y-1 focus:shadow-[0_10px_20px_-10px_rgba(44,187,93,0.3)]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-brandPrimary to-brandAccent hover:from-green-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darkBg focus:ring-brandPrimary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,161,22,0.4)] active:scale-95"
          >
            Sign In
          </button>
        </form>
        
        <div className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brandAccent hover:text-orange-400 transition-colors">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}
