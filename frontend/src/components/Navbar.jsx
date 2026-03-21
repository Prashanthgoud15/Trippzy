import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Map, Plane, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass px-6 py-4 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
        <div className="bg-brand-500 p-2 rounded-lg text-white group-hover:bg-brand-600 transition-colors">
          <Map size={24} />
        </div>
        <span className="text-2xl font-bold text-gray-800">
          Trippzy
        </span>
      </Link>
      
      {/* Desktop Nav Links */}
      <div className="hidden md:flex gap-6 items-center flex-1 justify-center">
        <Link to="/" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Home</Link>
        {user && (
          <>
            <Link to="/planner" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Plan Trip</Link>
            <Link to="/trips" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">My Trips</Link>
            <Link to="/profile" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Profile</Link>
          </>
        )}
      </div>

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition-colors">
              <User size={16} /> {user.name}
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-5 py-2 text-sm font-medium text-white bg-brand-500 rounded-full shadow-md shadow-brand-500/30 hover:bg-brand-600 hover:-translate-y-0.5 transition-all">
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)} 
        className="md:hidden p-2 text-gray-600 hover:text-brand-600 transition-colors"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Slide-Down Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-xl md:hidden animate-in slide-in-from-top">
          <div className="flex flex-col p-6 space-y-4">
            <Link to="/" onClick={closeMenu} className="text-gray-700 font-medium py-2 hover:text-brand-600 transition-colors">Home</Link>
            {user ? (
              <>
                <Link to="/planner" onClick={closeMenu} className="text-gray-700 font-medium py-2 hover:text-brand-600 transition-colors">Plan Trip</Link>
                <Link to="/trips" onClick={closeMenu} className="text-gray-700 font-medium py-2 hover:text-brand-600 transition-colors">My Trips</Link>
                <Link to="/profile" onClick={closeMenu} className="text-gray-700 font-medium py-2 hover:text-brand-600 transition-colors">Profile</Link>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-2 text-sm text-gray-500 py-1">
                  <User size={16} /> {user.name}
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="text-center py-3 text-gray-700 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  Login
                </Link>
                <Link to="/signup" onClick={closeMenu} className="text-center py-3 text-white font-medium bg-brand-500 rounded-xl shadow-md shadow-brand-500/30 hover:bg-brand-600 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
