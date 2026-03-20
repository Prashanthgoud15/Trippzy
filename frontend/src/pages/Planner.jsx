import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import { MapPin, Calendar, Wallet, CheckSquare, Sparkles, Users } from 'lucide-react';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

const tripTypes = ['Nature', 'Adventure', 'Food & Culinary', 'Culture & History', 'Relaxation', 'City Exploration', 'Nightlife', 'Shopping', 'Photography', 'Spiritual'];
const travelerOptions = [
  { value: 'Solo', label: '🧑 Solo', desc: 'Just me' },
  { value: 'Couple', label: '💑 Couple', desc: '2 travelers' },
  { value: 'Family', label: '👨‍👩‍👧‍👦 Family', desc: '3-5 travelers' },
  { value: 'Group', label: '👥 Group', desc: '6+ travelers' },
];

const Planner = () => {
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'Medium',
    tripType: [],
    travelers: 'Couple',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleTypeToggle = (type) => {
    setFormData(prev => {
      if (prev.tripType.includes(type)) {
        return { ...prev, tripType: prev.tripType.filter(t => t !== type) };
      } else {
        return { ...prev, tripType: [...prev.tripType, type] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/trips`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/trips/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate itinerary. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center pt-16">
        <Loader text="Our AI is crafting your personalized dream trip with hotel picks, local cuisine, packing tips & more..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col pt-24 font-sans">
      <div className="flex-grow max-w-4xl w-full mx-auto px-6">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Tell us your travel preferences ✈️
          </h1>
          <p className="text-gray-500 text-lg">Just fill out this quick form, and our AI will generate a complete day-by-day itinerary with hotel picks, local food, packing tips & more.</p>
        </div>

        <div className="glass-card bg-white p-8 md:p-12 shadow-xl border border-gray-100 rounded-3xl">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm border border-red-100">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Destination */}
            <div className="space-y-2 relative">
              <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="text-brand-500" /> Whereto?
              </label>
              <input 
                type="text" 
                name="destination"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                required
                className="w-full px-5 py-4 text-lg bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all placeholder-gray-400"
                placeholder="e.g. Kyoto, Japan or a small village in Tuscany..."
              />
              <p className="text-xs text-gray-400 mt-1 pl-1">Supports any real-world location globally.</p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-brand-500" /> Start Date
                </label>
                <input 
                  type="date" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-indigo-500" /> End Date
                </label>
                <input 
                  type="date" 
                  name="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Travelers */}
            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Users className="text-brand-500" /> Who's traveling?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {travelerOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({...formData, travelers: opt.value})}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.travelers === opt.value 
                        ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm' 
                        : 'border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{opt.label.split(' ')[0]}</span>
                    <span className="font-semibold text-sm block">{opt.value}</span>
                    <span className="text-xs text-gray-400">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Wallet className="text-brand-500" /> What is your budget?
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['Low', 'Medium', 'High'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({...formData, budget: level})}
                    className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                      formData.budget === level 
                        ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm' 
                        : 'border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:bg-gray-50'
                    }`}
                  >
                    {level === 'Low' && '💸 Budget'}
                    {level === 'Medium' && '💰 Moderate'}
                    {level === 'High' && '💎 Luxury'}
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Type */}
            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <CheckSquare className="text-brand-500" /> What kind of activities suit your vibe?
              </label>
              <div className="flex flex-wrap gap-3 mt-2">
                {tripTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeToggle(type)}
                    className={`px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all ${
                      formData.tripType.includes(type)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:bg-gray-50'
                    }`}
                  >
                    {formData.tripType.includes(type) && '✓ '} {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Notes */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Anything specific you'd like included? (Optional)
              </label>
              <textarea 
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
                placeholder="e.g. Vegetarian food only, no long hikes, looking for romantic dinner spots..."
              ></textarea>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              className="w-full py-5 bg-gradient-to-r from-brand-500 to-indigo-600 text-white text-lg font-bold rounded-xl hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/30 transition-all flex justify-center items-center gap-2"
            >
              <Sparkles size={24} /> Generate My Trip
            </button>
            
          </form>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Planner;
