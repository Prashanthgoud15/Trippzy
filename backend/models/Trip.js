const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
  tripType: [{ type: String }],
  travelers: { type: String, default: 'Not specified' },
  notes: { type: String },
  itinerary: { type: mongoose.Schema.Types.Mixed, required: true },
  hotelRecommendations: { type: mongoose.Schema.Types.Mixed },
  localCuisineMustTry: { type: mongoose.Schema.Types.Mixed },
  packingChecklist: { type: mongoose.Schema.Types.Mixed },
  localPhrases: { type: mongoose.Schema.Types.Mixed },
  budgetBreakdown: { type: mongoose.Schema.Types.Mixed },
  bestTimeToVisit: { type: String },
  weatherInfo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
