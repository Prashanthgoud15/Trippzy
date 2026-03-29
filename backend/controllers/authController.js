const User = require('../models/User');
const Trip = require('../models/Trip');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Sanitize inputs
    name = name.trim().replace(/<[^>]*>/g, '').slice(0, 100);
    email = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (password.length > 128) {
      return res.status(400).json({ message: 'Password is too long' });
    }

    // Validate name
    if (name.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      // Send welcome email (non-blocking)
      sendWelcomeEmail(name, email);

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const trips = await Trip.find({ user: req.user.id }).sort('-createdAt');

    // Unique destinations
    const destinations = [...new Set(trips.map(t => t.destination))];

    // Favorite trip types
    const typeCount = {};
    trips.forEach(t => {
      (t.tripType || []).forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
    });
    const favoriteTypes = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));

    // Total days traveled
    let totalDays = 0;
    trips.forEach(t => {
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);
      totalDays += Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    });

    // Badges
    const badges = [];
    if (trips.length >= 1) badges.push({ icon: '🗺️', title: 'First Trip', desc: 'Planned your first adventure' });
    if (trips.length >= 3) badges.push({ icon: '✈️', title: 'Frequent Flyer', desc: 'Planned 3+ trips' });
    if (trips.length >= 5) badges.push({ icon: '🌍', title: 'Globe Trotter', desc: 'Planned 5+ trips' });
    if (trips.length >= 10) badges.push({ icon: '🏆', title: 'Travel Legend', desc: 'Planned 10+ trips' });
    if (destinations.length >= 3) badges.push({ icon: '📍', title: 'Explorer', desc: 'Visited 3+ destinations' });
    if (destinations.length >= 5) badges.push({ icon: '🧭', title: 'Wanderer', desc: 'Visited 5+ destinations' });
    if (totalDays >= 7) badges.push({ icon: '📅', title: 'Week Warrior', desc: '7+ days of travel planned' });
    if (totalDays >= 30) badges.push({ icon: '🌴', title: 'Month Master', desc: '30+ days of travel planned' });
    if (typeCount['Adventure']) badges.push({ icon: '⛰️', title: 'Thrill Seeker', desc: 'Planned an adventure trip' });
    if (typeCount['Food & Culinary']) badges.push({ icon: '🍜', title: 'Foodie', desc: 'Planned a culinary trip' });
    if (typeCount['Culture & History']) badges.push({ icon: '🏛️', title: 'Culture Buff', desc: 'Explored culture & history' });
    if (typeCount['Spiritual']) badges.push({ icon: '🕉️', title: 'Soul Seeker', desc: 'Planned a spiritual journey' });

    // Recent trips (last 5)
    const recentTrips = trips.slice(0, 5).map(t => ({
      _id: t._id,
      destination: t.destination,
      startDate: t.startDate,
      endDate: t.endDate,
      budget: t.budget,
      travelers: t.travelers,
    }));

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        memberSince: user.createdAt,
      },
      stats: {
        totalTrips: trips.length,
        totalDays,
        uniqueDestinations: destinations.length,
        destinations,
        favoriteTypes,
      },
      badges,
      recentTrips,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUserStats,
};

