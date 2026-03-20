import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plane, Calendar, MapPin, Trash2, ArrowRight, Plus, TrendingUp, Globe2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import API_URL from '../config/api';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

// Map destination name to an Unsplash photo (landscape, no CORS issues)
const getDestinationPhoto = (destination) => {
  const query = encodeURIComponent(destination.split(',')[0].trim());
  return `https://source.unsplash.com/800x400/?${query},travel,landscape`;
};

const gradients = [
  'from-blue-400 to-indigo-600',
  'from-rose-400 to-pink-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-purple-600',
  'from-sky-400 to-cyan-600',
];

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/trips`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrips(trips.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const totalDays = trips.reduce((acc, t) => {
    return acc + Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* ── PAGE HEADER ── */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-brand-600 font-semibold text-sm mb-1">Welcome back 👋</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">
              {user?.name ? `${user.name}'s Trips` : 'My Trips'}
            </h1>
            <p className="text-gray-500 mt-1">All your planned adventures in one place.</p>
          </div>
          <Link
            to="/planner"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-brand-500 to-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/20 transition-all shadow-sm"
          >
            <Plus size={18} /> Plan New Trip
          </Link>
        </div>
      </div>

      <div className="flex-grow max-w-6xl w-full mx-auto px-6 py-10">
        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { icon: <Plane size={22}/>, color: 'bg-brand-50 text-brand-600', label: 'Total Trips', value: trips.length },
            { icon: <Globe2 size={22}/>, color: 'bg-indigo-50 text-indigo-600', label: 'Destinations', value: [...new Set(trips.map(t => t.destination))].length },
            { icon: <Clock size={22}/>, color: 'bg-green-50 text-green-600', label: 'Total Days', value: totalDays },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5"
            >
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── TRIP CARDS ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-100" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-9 bg-gray-100 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-6">
              <Plane size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm">Plan your first AI-powered adventure! It only takes 30 seconds.</p>
            <Link to="/planner" className="bg-gradient-to-r from-brand-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all shadow-sm flex items-center gap-2">
              <Plus size={18} /> Plan Your First Trip
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, idx) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col group"
              >
                {/* Card image header — Unsplash + gradient fallback */}
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx % gradients.length]}`} />
                  <img
                    src={getDestinationPhoto(trip.destination)}
                    alt={trip.destination}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg flex items-center gap-2">
                      <MapPin size={18} className="text-white/80 flex-shrink-0" />
                      {trip.destination}
                    </h3>
                  </div>
                  {/* Delete btn top-right */}
                  <button
                    onClick={() => handleDelete(trip._id)}
                    className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-sm text-white rounded-lg hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  {/* Dates */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Calendar size={14} className="text-brand-400" />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} –{' '}
                      {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="px-2.5 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-semibold border border-brand-100">
                      {trip.budget === 'Low' ? '💸' : trip.budget === 'Medium' ? '💰' : '💎'} {trip.budget}
                    </span>
                    {(trip.tripType || []).slice(0, 2).map((type, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link
                      to={`/trips/${trip._id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-600 font-semibold rounded-xl border border-gray-100 hover:border-brand-200 transition-all text-sm"
                    >
                      View Itinerary <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Link
        to="/planner"
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-brand-500 to-blue-600 text-white rounded-full shadow-2xl shadow-brand-500/40 flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <Plus size={24} />
      </Link>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
