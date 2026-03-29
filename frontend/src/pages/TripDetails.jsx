import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import API_URL from '../config/api';
import { MapPin, Calendar, Wallet, Download, Copy, ArrowLeft, Sun, Coffee, Moon, ExternalLink, Star, Hotel, UtensilsCrossed, Backpack, Languages, CloudSun, IndianRupee, CheckCircle2, Share2 } from 'lucide-react';
import Footer from '../components/Footer';
import PhotoGallery from '../components/PhotoGallery';
import { AuthContext } from '../context/appAuthContext';

const TripDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedItems, setCheckedItems] = useState({});
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/trips/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrip(res.data);
      } catch {
        setError('Failed to fetch trip details. It might have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleCopyText = () => {
    if (!trip) return;
    let text = `✈️ Trip to ${trip.destination}\nDates: ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}\nBudget: ${trip.budget} | Travelers: ${trip.travelers || 'N/A'}\n\n`;

    if (trip.itinerary) {
      text += '📅 ITINERARY\n';
      trip.itinerary.forEach(day => {
        text += `\nDay ${day.day}: ${day.theme}\n`;
        day.activities.forEach(act => {
          text += `  ${act.time}: ${act.title} at ${act.locationName} (${act.estimatedCost})\n  ${act.description}\n`;
        });
      });
    }

    if (trip.hotelRecommendations?.length) {
      text += '\n🏨 HOTEL RECOMMENDATIONS\n';
      trip.hotelRecommendations.forEach(h => {
        text += `  ${h.name} - ${h.priceRange} (Rating: ${h.rating})\n  ${h.address}\n`;
      });
    }

    if (trip.localCuisineMustTry?.length) {
      text += '\n🍛 LOCAL CUISINE MUST-TRY\n';
      trip.localCuisineMustTry.forEach(c => {
        text += `  ${c.dish}: ${c.description} (${c.estimatedCost}) - Find at: ${c.whereToFind}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!trip) return;

    try {
      const userName = user?.name || 'Traveller';
      const startDateStr = new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const endDateStr = new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1;

      const element = contentRef.current;
      if (!element) return;

      // Hide map iframes in PDF to avoid blank map boxes.
      const iframes = element.querySelectorAll('iframe');
      iframes.forEach(f => {
        f.dataset.display = f.style.display;
        f.style.display = 'none';
      });

      const coverEl = document.createElement('div');
      coverEl.innerHTML = `
        <div style="min-height:270mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#1e3a8a;color:white;padding:60px 40px;page-break-after:always;margin-bottom:0;">
          <div style="font-size:52px;margin-bottom:12px;">✈️</div>
          <div style="font-size:12px;letter-spacing:4px;text-transform:uppercase;color:#93c5fd;margin-bottom:16px;font-weight:600;">TRIPPZY PRESENTS</div>
          <h1 style="font-size:40px;font-weight:900;margin:0 0 8px;line-height:1.2;color:white;">Welcome, ${userName}!</h1>
          <div style="width:60px;height:4px;background:#60a5fa;border-radius:2px;margin:16px auto;"></div>
          <div style="font-size:20px;color:#bfdbfe;margin-bottom:6px;">Your Trip to</div>
          <div style="font-size:34px;font-weight:900;color:white;margin-bottom:32px;">📍 ${trip.destination}</div>
          <div style="display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:36px;">
            <div style="background:rgba(255,255,255,0.15);padding:14px 22px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);">
              <div style="font-size:9px;color:#93c5fd;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">From</div>
              <div style="font-size:13px;font-weight:700;">${startDateStr}</div>
            </div>
            <div style="background:rgba(255,255,255,0.15);padding:14px 22px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);">
              <div style="font-size:9px;color:#93c5fd;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">To</div>
              <div style="font-size:13px;font-weight:700;">${endDateStr}</div>
            </div>
            <div style="background:rgba(255,255,255,0.15);padding:14px 22px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);">
              <div style="font-size:9px;color:#93c5fd;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Duration</div>
              <div style="font-size:13px;font-weight:700;">${days} Days</div>
            </div>
            <div style="background:rgba(255,255,255,0.15);padding:14px 22px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);">
              <div style="font-size:9px;color:#93c5fd;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">Budget</div>
              <div style="font-size:13px;font-weight:700;">${trip.budget}</div>
            </div>
          </div>
          <p style="font-size:13px;color:#93c5fd;max-width:380px;line-height:1.7;">Your AI-crafted itinerary is ready. Every detail curated just for you. Have an amazing journey! 🌟</p>
          <div style="margin-top:40px;font-size:11px;color:#4b6a9b;">Generated by Trippzy AI • ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      `;
      element.insertBefore(coverEl, element.firstChild);

      const closingEl = document.createElement('div');
      closingEl.innerHTML = `
        <div style="min-height:200mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:#064e3b;color:white;padding:60px 40px;page-break-before:always;margin-top:0;">
          <div style="font-size:56px;margin-bottom:18px;">🌴</div>
          <h1 style="font-size:34px;font-weight:900;margin:0 0 10px;color:white;">Bon Voyage, ${userName}!</h1>
          <div style="width:60px;height:4px;background:#34d399;border-radius:2px;margin:16px auto;"></div>
          <p style="font-size:15px;color:#a7f3d0;max-width:480px;line-height:1.8;margin-bottom:20px;">
            Thank you for choosing Trippzy to plan your adventure to <strong style="color:white;">${trip.destination}</strong>. 
            We hope every moment of your ${days}-day journey is filled with joy and unforgettable memories. ✨
          </p>
          <p style="font-size:12px;color:#6ee7b7;max-width:400px;line-height:1.7;margin-bottom:36px;">
            Safe travels! Come back whenever you're ready to plan your next adventure. The world is waiting! 🌍
          </p>
          <div style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:12px;padding:16px 32px;font-size:13px;font-weight:700;letter-spacing:2px;color:#a7f3d0;">
            TRIPPZY — AI-POWERED TRAVEL PLANNING
          </div>
          <div style="margin-top:28px;font-size:11px;color:#4b9a80;">support.trippzy@gmail.com</div>
        </div>
      `;
      element.appendChild(closingEl);

      await new Promise((r) => setTimeout(r, 200));

      const opt = {
        margin: 0,
        filename: `Trippzy_${trip.destination.replace(/[^a-zA-Z0-9]/g, '_')}_Itinerary.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      };

      await html2pdf().set(opt).from(element).save();

      element.removeChild(coverEl);
      element.removeChild(closingEl);
      iframes.forEach((f) => {
        f.style.display = f.dataset.display || '';
      });
    } catch (error) {
      console.error('PDF download failed:', error);
      setError('Failed to generate premium PDF. Please try again.');
    }
  };

  const toggleChecklist = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleShare = async () => {
    const shareData = {
      title: `Trippzy - Trip to ${trip.destination}`,
      text: `Check out my AI-generated travel itinerary for ${trip.destination}! ${trip.itinerary?.length || 0} days of adventure planned with Trippzy.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // User cancelled share dialog
    }
  };

  const getMapsUrl = (locationName) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
  };

  if (loading) return <div className="min-h-screen bg-brand-50 flex items-center justify-center pt-16 text-lg text-gray-500">Loading trip details...</div>;
  if (error || !trip) return <div className="min-h-screen bg-brand-50 flex items-center justify-center pt-16 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col pt-24 font-sans pb-20">
      <div className="flex-grow max-w-5xl w-full mx-auto px-6">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Link to="/trips" className="flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors bg-white px-4 py-2 rounded-lg border border-gray-200">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={handleCopyText} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
              <Copy size={16} /> {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={handleDownloadPDF} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors shadow-sm">
              <Download size={16} /> Download PDF
            </button>
            <button onClick={handleShare} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors shadow-sm">
              <Share2 size={16} /> {shared ? 'Link Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div ref={contentRef}>

          {/* Trip Overview Card */}
          <div className="glass-card bg-white p-8 mb-12 shadow-sm border border-gray-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="text-center mb-8 relative z-10">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <MapPin className="text-brand-500" size={36} /> {trip.destination}
              </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              <div className="bg-brand-50 p-4 rounded-xl text-center border border-brand-100 flex flex-col items-center justify-center">
                <Calendar className="text-brand-500 mb-2" />
                <p className="font-semibold text-gray-800">{trip.itinerary?.length || 0} Day Trip</p>
                <p className="text-sm text-gray-600">
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100 flex flex-col items-center justify-center">
                <Wallet className="text-green-500 mb-2" />
                <p className="font-semibold text-gray-800">Budget: {trip.budget === 'Low' ? 'Budget' : trip.budget === 'Medium' ? 'Moderate' : 'Luxury'}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100 flex flex-col items-center justify-center">
                <div className="text-2xl mb-1">
                  {trip.travelers === 'Solo' ? '🧑' : trip.travelers === 'Couple' ? '💑' : trip.travelers === 'Family' ? '👨‍👩‍👧‍👦' : '👥'}
                </div>
                <p className="font-semibold text-gray-800">Travelers: {trip.travelers || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Destination Photo Gallery */}
          <PhotoGallery destination={trip.destination} itinerary={trip.itinerary} />

          {/* Weather & Best Time */}
          {(trip.bestTimeToVisit || trip.weatherInfo) && (
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl border border-sky-200 mb-12">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CloudSun className="text-sky-500" /> Weather & Best Time to Visit
              </h2>
              {trip.weatherInfo && <p className="text-gray-700 mb-2">🌤️ <strong>Current Weather:</strong> {trip.weatherInfo}</p>}
              {trip.bestTimeToVisit && <p className="text-gray-700">📅 <strong>Best Time:</strong> {trip.bestTimeToVisit}</p>}
            </div>
          )}

          {/* Hotel Recommendations */}
          {trip.hotelRecommendations?.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Hotel className="text-brand-500" /> 🏨 Hotel Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {trip.hotelRecommendations.map((hotel, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 flex items-start gap-1 mb-3">
                      <MapPin size={14} className="text-red-400 mt-0.5 flex-shrink-0" /> {hotel.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-md">
                          <IndianRupee size={12} /> {hotel.priceRange}
                        </span>
                        <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                          <Star size={14} className="fill-amber-400 text-amber-400" /> {hotel.rating}
                        </span>
                      </div>
                      <a 
                        href={hotel.googleMapsUrl || getMapsUrl(hotel.name + ' ' + hotel.address)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brand-600 text-sm font-semibold flex items-center gap-1 hover:underline"
                      >
                        Open in Google Maps <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget Breakdown */}
          {trip.budgetBreakdown && Object.keys(trip.budgetBreakdown).length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 mb-12">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <IndianRupee className="text-green-600" /> 💰 Estimated Budget Breakdown
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {trip.budgetBreakdown.accommodation && (
                  <div className="bg-white p-3 rounded-xl text-center border border-green-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">🏨 Stay</p>
                    <p className="font-bold text-gray-800">{trip.budgetBreakdown.accommodation}</p>
                  </div>
                )}
                {trip.budgetBreakdown.food && (
                  <div className="bg-white p-3 rounded-xl text-center border border-green-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">🍽️ Food</p>
                    <p className="font-bold text-gray-800">{trip.budgetBreakdown.food}</p>
                  </div>
                )}
                {trip.budgetBreakdown.transport && (
                  <div className="bg-white p-3 rounded-xl text-center border border-green-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">🚗 Transport</p>
                    <p className="font-bold text-gray-800">{trip.budgetBreakdown.transport}</p>
                  </div>
                )}
                {trip.budgetBreakdown.activities && (
                  <div className="bg-white p-3 rounded-xl text-center border border-green-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">🎯 Activities</p>
                    <p className="font-bold text-gray-800">{trip.budgetBreakdown.activities}</p>
                  </div>
                )}
              </div>
              {trip.budgetBreakdown.total && (
                <div className="bg-white p-4 rounded-xl border-2 border-green-300 text-center">
                  <p className="text-sm text-gray-500 font-semibold">ESTIMATED TOTAL</p>
                  <p className="text-2xl font-extrabold text-green-700">{trip.budgetBreakdown.total}</p>
                </div>
              )}
            </div>
          )}

          {/* Days List */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Day-by-Day Itinerary</h2>
          <div className="space-y-10 mb-12">
            {trip.itinerary && trip.itinerary.map((day, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-brand-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm">
                      {day.day}
                    </span>
                    Day {day.day}: {day.theme}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-5">
                    {day.activities.map((act, i) => {
                       let Icon = Sun;
                       let colorClass = "text-orange-500 bg-orange-50 border-orange-100";
                       if (act.time.toLowerCase().includes('afternoon') || act.time.toLowerCase().includes('lunch')) {
                         Icon = Coffee;
                         colorClass = "text-amber-500 bg-amber-50 border-amber-100";
                       } else if (act.time.toLowerCase().includes('evening') || act.time.toLowerCase().includes('dinner')) {
                         Icon = Moon;
                         colorClass = "text-indigo-500 bg-indigo-50 border-indigo-100";
                       }
                       
                       return (
                        <div key={i} className={`p-4 rounded-xl border ${colorClass} transition-all hover:bg-white hover:shadow-md`}>
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg bg-white shadow-sm mt-1`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                                <h3 className="font-bold text-gray-900">{act.title}</h3>
                                <span className="text-xs font-semibold px-2 py-1 bg-white rounded-md text-gray-600 border border-gray-100 shadow-sm whitespace-nowrap">
                                  {act.time}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{act.description}</p>
                              
                              {/* Mini Map + Info Row */}
                              <div className="flex flex-col sm:flex-row gap-3">
                                {/* Mini Map */}
                                <a
                                  href={act.googleMapsUrl || getMapsUrl(act.locationName)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block flex-shrink-0 rounded-xl overflow-hidden border-2 border-gray-100 hover:border-brand-300 transition-all hover:shadow-md group/map"
                                >
                                  <iframe
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(act.locationName)}&output=embed&z=14`}
                                    width="160"
                                    height="100"
                                    style={{ border: 0, pointerEvents: 'none' }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={act.locationName}
                                  ></iframe>
                                </a>
                                <div className="flex flex-col justify-between">
                                  <a
                                    href={act.googleMapsUrl || getMapsUrl(act.locationName)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                                  >
                                    <MapPin size={12} /> {act.locationName} <ExternalLink size={10} />
                                  </a>
                                  <span className="flex items-center gap-1 text-xs bg-white px-2 py-1.5 rounded-md border border-gray-100 shadow-sm text-green-700 font-semibold w-fit mt-2">
                                    <Wallet size={12} className="text-green-500" /> {act.estimatedCost}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                       );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Local Cuisine Must-Try */}
          {trip.localCuisineMustTry?.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <UtensilsCrossed className="text-orange-500" /> 🍛 Local Cuisine Must-Try
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {trip.localCuisineMustTry.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.dish}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <MapPin size={12} className="text-red-400" /> {item.whereToFind}
                      </span>
                      <span className="font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">{item.estimatedCost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Local Phrases */}
          {trip.localPhrases?.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Languages className="text-purple-500" /> 🗣️ Useful Local Phrases
              </h2>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-5 py-3 text-sm font-bold text-gray-600">Phrase</th>
                      <th className="text-left px-5 py-3 text-sm font-bold text-gray-600">Meaning</th>
                      <th className="text-left px-5 py-3 text-sm font-bold text-gray-600 hidden md:table-cell">Pronunciation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trip.localPhrases.map((p, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-semibold text-brand-700">{p.phrase}</td>
                        <td className="px-5 py-3 text-gray-700">{p.meaning}</td>
                        <td className="px-5 py-3 text-gray-500 italic hidden md:table-cell">{p.pronunciation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Packing Checklist */}
          {trip.packingChecklist?.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Backpack className="text-teal-500" /> 🎒 Smart Packing Checklist
              </h2>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {trip.packingChecklist.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleChecklist(idx)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                        checkedItems[idx] 
                          ? 'bg-green-50 border-green-200 text-green-700 line-through' 
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CheckCircle2 size={18} className={checkedItems[idx] ? 'text-green-500' : 'text-gray-300'} />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
        {/* End PDF Content Area */}

      </div>
      <Footer />
    </div>
  );
};

export default TripDetails;
