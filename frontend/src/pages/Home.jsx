import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { Plane, MapPin, Clock, Users, ArrowRight, Star, Sparkles, Shield, Download, Share2, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">

        {/* Premium mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,_#dbeafe_0%,_#f0f9ff_40%,_#ffffff_70%)]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-200/30 blur-3xl" />
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-semibold text-sm mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            AI-Powered Travel Intelligence
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.05] mb-6">
            Plan Your Dream Trip{' '}
            <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-blue-500 to-indigo-600">
              Instantly with AI ✨
            </span>
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            From hidden hill villages to global metropolises — get a complete day-by-day itinerary, hotel picks, local food, and packing list in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/planner"
              className="group px-8 py-4 bg-gradient-to-r from-brand-500 to-blue-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Plane size={20} className="group-hover:translate-x-1 transition-transform" />
              {user ? 'Plan a Trip' : 'Start Planning Free'}
            </Link>
            {user ? (
              <Link to="/trips" className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg hover:bg-gray-50 border border-gray-200 shadow-sm hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center">
                Go to Dashboard →
              </Link>
            ) : (
              <Link to="/login" className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg hover:bg-gray-50 border border-gray-200 shadow-sm hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center">
                Sign In
              </Link>
            )}
          </div>

          {/* Social proof mini-stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            {[
              { num: '10,000+', label: 'Trips Planned' },
              { num: '150+', label: 'Countries' },
              { num: '4.9★', label: 'Avg Rating' },
              { num: 'Free', label: 'Forever' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-bold text-gray-800 text-base">{stat.num}</span>
                <span>{stat.label}</span>
                {i < 3 && <span className="text-gray-200 ml-2">|</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero mockup card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-20 w-full max-w-2xl"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-100 border border-gray-100 overflow-hidden">
            {/* Card header bar */}
            <div className="bg-gradient-to-r from-brand-500 to-indigo-600 px-6 py-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/40" />
                <div className="w-3 h-3 rounded-full bg-white/40" />
                <div className="w-3 h-3 rounded-full bg-white/40" />
              </div>
              <span className="text-white/80 text-xs font-medium mx-auto">✈️ Trippzy AI — Generating your trip...</span>
            </div>
            <div className="p-6 md:p-8 text-left">
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: 'Destination', icon: <MapPin size={11}/>, value: 'Santorini, Greece' },
                  { label: 'Duration', icon: <Clock size={11}/>, value: '5 Days' },
                  { label: 'Budget', icon: <Users size={11}/>, value: 'Medium' },
                ].map((item, i) => (
                  <div key={i}>
                    <span className="text-xs text-brand-500 font-semibold uppercase tracking-wider flex items-center gap-1">{item.icon} {item.label}</span>
                    <p className="font-semibold text-gray-800 mt-1 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-brand-50 to-indigo-50 p-4 rounded-2xl border border-brand-100/50">
                <p className="text-xs font-bold text-brand-600 mb-2 flex items-center gap-1"><Sparkles size={12}/> AI Generated Sample</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-medium text-gray-800">Day 1:</span> 🌅 Sunrise at Oia Village → 🏛 Akrotiri Archaeological Site → 🍷 Wine Tasting at Santo Wines → 🌊 Private beach sunset dinner...
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Your trip in 3 steps</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-brand-200 to-indigo-200" />
            {[
              { step: '01', icon: '📍', title: 'Enter your destination', desc: 'Any city, village, or country. Our AI handles remote places too.' },
              { step: '02', icon: '⚙️', title: 'Set your preferences', desc: 'Budget, travel style, dates and group type — personalised to you.' },
              { step: '03', icon: '🚀', title: 'Get your itinerary', desc: 'Complete day-by-day plan with hotels, food, maps & packing list.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-full bg-brand-500 text-white text-xs font-black flex items-center justify-center mx-auto mb-4">{item.step}</div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">Everything you need 🌟</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-4">One platform that handles every part of your travel planning</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Globe size={22}/>, color: 'bg-blue-50 text-blue-600', title: 'Any Destination', desc: 'From Maldives to remote Himalayan villages — we cover everywhere.' },
              { icon: <Sparkles size={22}/>, color: 'bg-violet-50 text-violet-600', title: 'AI-Crafted Plans', desc: 'Real-time AI builds detailed itineraries tailored to your style.' },
              { icon: <MapPin size={22}/>, color: 'bg-rose-50 text-rose-600', title: 'Interactive Maps', desc: 'Each activity comes with a mini map and Google Maps link.' },
              { icon: <Shield size={22}/>, color: 'bg-green-50 text-green-600', title: 'Budget Aware', desc: 'Hotel and activity picks that strictly match your budget tier.' },
              { icon: <Download size={22}/>, color: 'bg-amber-50 text-amber-600', title: 'PDF Download', desc: 'Download a beautifully designed PDF itinerary with cover page.' },
              { icon: <Share2 size={22}/>, color: 'bg-pink-50 text-pink-600', title: 'Share Trips', desc: 'Share your trip link or itinerary with friends instantly.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white group"
              >
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (static but looks real) ─────────── */}
      {/* <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl font-black text-gray-900">Loved by travelers 💬</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', dest: 'Trip to Kerala', stars: 5, text: 'Trippzy planned my entire Kerala holiday in under a minute! The local food suggestions were spot-on.' },
              { name: 'Arjun M.', dest: 'Trip to Goa', stars: 5, text: 'I was skeptical about AI planning, but the itinerary was better than what I could have made myself.' },
              { name: 'Neha R.', dest: 'Trip to Manali', stars: 5, text: 'The packing checklist and hotel recommendations were perfect for a budget solo trip. Highly recommend!' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, s) => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.dest}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-brand-600 via-blue-600 to-indigo-700 text-white text-center relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-6">🗺️</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Your next adventure <br className="hidden md:block"/>is one click away
            </h2>
            <p className="text-brand-100 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of travelers who plan smarter with Trippzy. 100% free, forever.
            </p>
            <Link
              to="/planner"
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-brand-600 rounded-full font-black text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-2xl shadow-black/20"
            >
              <Plane size={22} />
              Plan My Trip Now
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
