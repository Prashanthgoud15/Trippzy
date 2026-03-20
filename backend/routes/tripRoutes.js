const express = require('express');
const router = express.Router();
const {
  generateTrip,
  getUserTrips,
  getTripById,
  deleteTrip
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, generateTrip)
  .get(protect, getUserTrips);

router.route('/:id')
  .get(protect, getTripById)
  .delete(protect, deleteTrip);

module.exports = router;
