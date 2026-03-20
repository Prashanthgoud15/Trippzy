const Trip = require('../models/Trip');
const User = require('../models/User');
const { generateItinerary } = require('../services/aiService');
const { sendItineraryEmail } = require('../services/emailService');

const generateTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, tripType, notes, travelers } = req.body;

    if (!destination || !startDate || !endDate || !budget) {
      return res.status(400).json({ message: 'Please provide required trip details' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Call Groq API with all params including travelers
    const aiResponse = await generateItinerary({
      destination,
      days,
      budget,
      tripType,
      notes,
      travelers
    });

    if (!aiResponse) {
      return res.status(500).json({ message: 'Failed to generate itinerary with AI' });
    }

    const trip = await Trip.create({
      user: req.user.id,
      destination,
      startDate,
      endDate,
      budget,
      tripType,
      travelers,
      notes,
      itinerary: aiResponse.itinerary || aiResponse,
      hotelRecommendations: aiResponse.hotelRecommendations || [],
      localCuisineMustTry: aiResponse.localCuisineMustTry || [],
      packingChecklist: aiResponse.packingChecklist || [],
      localPhrases: aiResponse.localPhrases || [],
      budgetBreakdown: aiResponse.budgetBreakdown || {},
      bestTimeToVisit: aiResponse.bestTimeToVisit || '',
      weatherInfo: aiResponse.weatherInfo || '',
    });

    // Send itinerary email (non-blocking)
    const user = await User.findById(req.user.id).select('name email');
    if (user) {
      sendItineraryEmail(user.email, user.name, trip);
    }

    res.status(201).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await trip.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateTrip,
  getUserTrips,
  getTripById,
  deleteTrip
};
