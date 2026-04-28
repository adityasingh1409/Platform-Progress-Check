import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Register State
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email: loginEmail, password: loginPassword });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username: regUsername, email: regEmail, password: regPassword });
      setIsLogin(true);
      setRegError('');
      navigate('/login');
    } catch (err) {
      setRegError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lightBg text-gray-900 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-brandPrimary/10 to-brandAccent/5 pointer-events-none" />
      
      <div className="relative w-full max-w-4xl h-[600px] bg-lightCard/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex z-10">
        
        {/* Mobile View Toggle */}
        <div className="absolute top-4 right-4 z-50 md:hidden">
            <button 
                onClick={() => {
                    setIsLogin(!isLogin);
                    navigate(isLogin ? '/register' : '/login');
                }} 
                className="text-sm font-bold text-brandPrimary hover:text-brandAccent transition-colors bg-white/80 px-4 py-2 rounded-full shadow-md"
            >
                {isLogin ? 'Go to Sign Up' : 'Go to Sign In'}
            </button>
        </div>

        {/* --- LOGIN FORM --- */}
        <div 
            className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-8 md:p-12 transition-all duration-700 ease-in-out flex flex-col justify-center ${isLogin ? 'opacity-100 z-20 pointer-events-auto translate-x-0' : 'opacity-0 z-0 pointer-events-none md:-translate-x-10'}`}
        >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brandPrimary to-brandAccent mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-600">Log in to track your coding progress.</p>
            </div>
            
            {loginError && <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md text-center">{loginError}</div>}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-brandAccent transition-colors">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none transition-all duration-300 placeholder-gray-500 text-gray-900"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-brandAccent transition-colors">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none transition-all duration-300 placeholder-gray-500 text-gray-900"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-brandPrimary to-brandAccent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95"
              >
                Sign In
              </button>
            </form>
        </div>


        {/* --- REGISTER FORM --- */}
        <div 
            className={`absolute top-0 right-0 w-full md:w-1/2 h-full p-8 md:p-12 transition-all duration-700 ease-in-out flex flex-col justify-center ${!isLogin ? 'opacity-100 z-20 pointer-events-auto translate-x-0' : 'opacity-0 z-0 pointer-events-none md:translate-x-10'}`}
        >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brandPrimary to-brandAccent mb-2">
                Create an Account
              </h2>
              <p className="text-sm text-gray-600">Start tracking your competitive programming journey.</p>
            </div>
            
            {regError && <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-md text-center">{regError}</div>}

            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-brandAccent transition-colors">Username</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none transition-all duration-300 placeholder-gray-500 text-gray-900"
                  placeholder="dev_ninja"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-brandAccent transition-colors">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none transition-all duration-300 placeholder-gray-500 text-gray-900"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-brandAccent transition-colors">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brandPrimary focus:border-transparent outline-none transition-all duration-300 placeholder-gray-500 text-gray-900"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-brandPrimary to-brandAccent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 mt-4"
              >
                Sign Up
              </button>
            </form>
        </div>


        {/* --- OVERLAY PANEL (IMAGE) --- */}
        <div 
            className="hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-30 shadow-2xl"
            style={{ transform: isLogin ? 'translateX(0)' : 'translateX(-100%)' }}
        >
            <div className="relative w-full h-full bg-brandPrimary">
                <img src="/auth_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Auth Background" />
                <div className="absolute inset-0 bg-gradient-to-br from-brandPrimary/80 to-brandAccent/60 flex flex-col items-center justify-center text-white p-12 text-center backdrop-blur-[2px]">
                    
                    <h2 className="text-4xl font-extrabold mb-6 drop-shadow-lg">
                        {isLogin ? 'New Here?' : 'Welcome Back!'}
                    </h2>
                    
                    <p className="mb-8 text-lg font-medium opacity-90 drop-shadow-md">
                        {isLogin 
                            ? 'Sign up and discover a great amount of new opportunities and track your progress!' 
                            : 'To keep connected with us please login with your personal info.'}
                    </p>
                    
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            navigate(isLogin ? '/register' : '/login');
                        }} 
                        className="px-10 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-brandPrimary transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:scale-95"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
