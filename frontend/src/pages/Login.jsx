import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/appAuthContext';
import { Mail, Lock } from 'lucide-react';
import Footer from '../components/Footer';
import API_URL from '../config/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      login(res.data, res.data.token);
      navigate('/trips');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col pt-10">
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="glass-card w-full max-w-md p-8 md:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back! ✨</h2>
            <p className="text-gray-500">Log in to view and plan your trips</p>
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-70 transition-all shadow-md shadow-brand-500/30"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-gray-600 text-sm">
            Don't have an account? <Link to="/signup" className="text-brand-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
