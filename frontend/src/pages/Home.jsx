import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Plane, MapPin, Clock, Sparkles, Shield, Download, Share2, Globe, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Real Unsplash travel photo background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop"
            alt="Beautiful tropical beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <p className="text-white/60 text-sm tracking-[0.25em] uppercase mb-6 font-medium">
              AI-Powered Travel Planning
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl text-white font-semibold leading-[1.15] mb-6 tracking-tight">
              Your next adventure{' '}
              <br className="hidden sm:block" />
              starts here
            </h1>

            <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
              Tell us your dream destination, and our AI will craft a complete
              day-by-day itinerary with hotels, local cuisine, maps & packing list.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/planner"
                className="group px-7 py-3.5 bg-white text-gray-900 rounded-full font-medium hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Plane size={18} className="text-brand-600" />
                {user ? 'Plan a Trip' : 'Start Planning — Free'}
                <ArrowRight size={15} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </Link>
              <Link
                to={user ? '/trips' : '/login'}
                className="px-7 py-3.5 text-white/90 rounded-full font-medium border border-white/25 hover:bg-white/10 transition-all w-full sm:w-auto text-center"
              >
                {user ? 'My Dashboard' : 'Sign In'}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">How it works</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">Plan in three simple steps</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: '01', icon: '📍', title: 'Enter destination', desc: 'Any city, village, or country. Even the most remote places work.' },
              { num: '02', icon: '⚙️', title: 'Set preferences', desc: 'Budget tier, travel style, dates, and group size.' },
              { num: '03', icon: '✈️', title: 'Get your itinerary', desc: 'Complete plan with hotels, food, map links & packing checklist.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-brand-500 text-xs font-bold tracking-widest mb-4">{item.num}</p>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PHOTO STRIP + FEATURES ═══════════════ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Destination photo strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-4 gap-3 mb-20 rounded-2xl overflow-hidden"
          >
            {[
              { src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop', label: 'India' },
              { src: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop', label: 'Italy' },
              { src: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&h=300&fit=crop', label: 'Japan' },
              { src: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=300&fit=crop', label: 'Maldives' },
            ].map((dest, i) => (
              <div key={i} className="relative group overflow-hidden rounded-xl aspect-[4/3]">
                <img src={dest.src} alt={dest.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-sm font-medium">{dest.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Features heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-brand-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Features</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">Everything for your trip</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Globe size={20}/>, color: 'text-sky-600 bg-sky-50', title: 'Any Destination', desc: 'Works for Maldives, remote Himalayan villages, and everywhere in between.' },
              { icon: <Sparkles size={20}/>, color: 'text-violet-600 bg-violet-50', title: 'AI-Crafted Plans', desc: 'Detailed day-by-day itineraries generated in real time, tailored to you.' },
              { icon: <MapPin size={20}/>, color: 'text-rose-600 bg-rose-50', title: 'Interactive Maps', desc: 'Every activity comes with a mini map and Google Maps link.' },
              { icon: <Shield size={20}/>, color: 'text-emerald-600 bg-emerald-50', title: 'Budget Smart', desc: 'Hotel and activity picks that truly respect your budget tier.' },
              { icon: <Download size={20}/>, color: 'text-amber-600 bg-amber-50', title: 'PDF Export', desc: 'Download a beautiful PDF itinerary with personalized cover page.' },
              { icon: <Share2 size={20}/>, color: 'text-pink-600 bg-pink-50', title: 'Share Instantly', desc: 'Share your trip link or copy the full itinerary in one click.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ITINERARY PREVIEW ═══════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-brand-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Preview</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">What you'll get</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 overflow-hidden"
          >
            <div className="bg-gray-900 px-5 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              </div>
              <span className="text-gray-500 text-xs ml-2">Trippzy — AI Itinerary</span>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-x-8 gap-y-2 mb-6 text-sm">
                <div><span className="text-gray-400 text-xs">Destination</span><p className="font-medium text-gray-800">Santorini, Greece</p></div>
                <div><span className="text-gray-400 text-xs">Duration</span><p className="font-medium text-gray-800">5 Days</p></div>
                <div><span className="text-gray-400 text-xs">Budget</span><p className="font-medium text-gray-800">Medium</p></div>
              </div>
              <div className="space-y-2.5">
                {[
                  { d: 1, t: 'Arrival & Oia Sunset', a: '🌅 Oia Village → 🍷 Wine Tasting → 🌊 Waterfront Dinner' },
                  { d: 2, t: 'History & Beaches', a: '🏛 Akrotiri Ruins → 🏖 Red Beach → 🍽 Local Taverna' },
                  { d: 3, t: 'Island Tour', a: '⛵ Caldera Cruise → 🌋 Hot Springs → 🎶 Evening Live Music' },
                ].map(d => (
                  <div key={d.d} className="flex gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                    <div className="w-7 h-7 rounded-md bg-brand-500 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">{d.d}</div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{d.t}</p>
                      <p className="text-gray-500 text-xs truncate">{d.a}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">+ 2 more days, hotels, packing list, budget breakdown...</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-brand-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">What travelers say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Priya S.', trip: 'Kerala', text: 'Planned my entire Kerala holiday in under a minute. The local food suggestions were spot-on!' },
              { name: 'Arjun M.', trip: 'Goa', text: 'I was skeptical about AI planning but the itinerary was better than what I made manually.' },
              { name: 'Neha R.', trip: 'Manali', text: 'The packing checklist and hotel picks were perfect for my budget solo trip. Love it!' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-6 rounded-2xl border border-gray-100"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => <Star key={s} size={12} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">Trip to {t.trip}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative py-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl text-white font-semibold mb-4 leading-tight">
            Ready for your next journey?
          </h2>
          <p className="text-white/60 text-lg mb-10">
            100% free. No sign-up required to start planning.
          </p>
          <Link
            to="/planner"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium text-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <Plane size={18} className="text-brand-600" />
            Plan My Trip
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
