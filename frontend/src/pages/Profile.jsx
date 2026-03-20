import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import { User, MapPin, Calendar, Award, TrendingUp, Plane, Clock, Globe2, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/auth/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to load profile stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="min-h-screen bg-brand-50 flex items-center justify-center pt-16 text-gray-500">Loading profile...</div>;
  if (!data) return <div className="min-h-screen bg-brand-50 flex items-center justify-center pt-16 text-red-500">Failed to load profile</div>;

  const { user: profile, stats, badges, recentTrips } = data;
  const memberDate = new Date(profile.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col pt-24 font-sans pb-20">
      <div className="flex-grow max-w-5xl w-full mx-auto px-6">

        {/* Profile Header */}
        <div className="glass-card bg-white p-8 mb-8 shadow-sm border border-gray-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-400/10 to-indigo-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/30">
              {initials}
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500 mt-1">{profile.email}</p>
              <div className="flex items-center gap-2 justify-center md:justify-start mt-2 text-sm text-gray-400">
                <Clock size={14} /> Member since {memberDate}
              </div>
            </div>

            <Link
              to="/planner"
              className="px-6 py-3 bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-500/30 transition-all flex items-center gap-2"
            >
              <Plane size={18} /> Plan New Trip
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm text-center hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="text-brand-500" size={24} />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{stats.totalTrips}</p>
            <p className="text-sm text-gray-500 mt-1">Trips Planned</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm text-center hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-3">
              <Globe2 className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{stats.uniqueDestinations}</p>
            <p className="text-sm text-gray-500 mt-1">Destinations</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm text-center hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
              <Calendar className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{stats.totalDays}</p>
            <p className="text-sm text-gray-500 mt-1">Days Planned</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm text-center hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
              <Award className="text-amber-500" size={24} />
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{badges.length}</p>
            <p className="text-sm text-gray-500 mt-1">Badges Earned</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Badges */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Award className="text-amber-500" /> 🏅 Achievement Badges
              </h2>
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {badges.map((badge, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                      <span className="text-3xl block mb-2">{badge.icon}</span>
                      <p className="font-bold text-gray-800 text-sm">{badge.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Award size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No badges yet. Plan your first trip to earn one!</p>
                </div>
              )}
            </div>

            {/* Recent Trips */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Plane className="text-brand-500" /> ✈️ Recent Trips
              </h2>
              {recentTrips.length > 0 ? (
                <div className="space-y-3">
                  {recentTrips.map((trip) => (
                    <Link
                      key={trip._id}
                      to={`/trips/${trip._id}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-brand-50 hover:border-brand-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                          <MapPin size={18} className="text-brand-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-brand-700 transition-colors">{trip.destination}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="bg-white px-2 py-1 rounded-md border border-gray-100 text-gray-500 font-medium">
                          {trip.budget === 'Low' ? '💸' : trip.budget === 'Medium' ? '💰' : '💎'} {trip.budget}
                        </span>
                        {trip.travelers && (
                          <span className="bg-white px-2 py-1 rounded-md border border-gray-100 text-gray-500 font-medium hidden sm:block">
                            👥 {trip.travelers}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Plane size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No trips yet!</p>
                  <Link to="/planner" className="text-brand-500 font-semibold text-sm hover:underline mt-2 inline-block">Plan your first trip →</Link>
                </div>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">

            {/* Favorite Trip Types */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="text-pink-500" /> Favorite Vibes
              </h2>
              {stats.favoriteTypes.length > 0 ? (
                <div className="space-y-3">
                  {stats.favoriteTypes.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full"
                            style={{ width: `${Math.min((item.count / stats.totalTrips) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 w-6 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Plan trips to see your favorites!</p>
              )}
            </div>

            {/* Destinations Visited */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Globe2 className="text-green-500" /> Places Explored
              </h2>
              {stats.destinations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stats.destinations.map((dest, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                      📍 {dest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No destinations yet</p>
              )}
            </div>

          </div>
        </div>

      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
