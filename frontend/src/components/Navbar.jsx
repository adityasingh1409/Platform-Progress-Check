import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="bg-darkCard shadow-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-brandPrimary to-brandAccent flex items-center justify-center text-white font-bold text-xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg group-hover:shadow-brandPrimary/50">
              P
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-brandPrimary to-brandAccent">
              Progress Tracker
            </span>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-brandAccent after:transition-all after:duration-300 hover:after:w-full hover:text-brandAccent hover:-translate-y-0.5 ${
                  location.pathname === link.path ? 'text-brandAccent after:w-full' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium text-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
