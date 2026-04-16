const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const EventType = require('../models/EventType');
const User = require('../models/User');

// POST /api/bookings  – public: create a new booking
router.post('/', async (req, res) => {
  try {
    const { eventTypeId, attendeeName, attendeeEmail, attendeeTimezone, startTime, endTime, notes } = req.body;
    if (!eventTypeId || !attendeeName || !attendeeEmail || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const eventType = await EventType.findById(eventTypeId);
    if (!eventType) return res.status(404).json({ message: 'Event type not found' });

    const booking = new Booking({
      eventTypeId,
      hostUserId: eventType.userId,
      attendeeName,
      attendeeEmail,
      attendeeTimezone: attendeeTimezone || 'UTC',
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      notes
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/bookings  – protected: list my upcoming bookings as host
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ hostUserId: req.userId, status: { $ne: 'CANCELLED' } })
      .populate('eventTypeId', 'title length slug')
      .sort({ startTime: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/:id  – get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, hostUserId: req.userId })
      .populate('eventTypeId', 'title length slug');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/bookings/:id/cancel  – cancel a booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, hostUserId: req.userId },
      { $set: { status: 'CANCELLED', cancellationReason: req.body.reason || '' } },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/public/:username/:slug  – public availability for booking page
router.get('/public/:username/:slug', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const eventType = await EventType.findOne({ userId: user._id, slug: req.params.slug, hidden: false });
    if (!eventType) return res.status(404).json({ message: 'Event type not found' });

    // Return event type info for public booking page
    res.json({
      host: { id: user._id, name: user.name, username: user.username, avatar: user.avatar, bio: user.bio },
      eventType: { id: eventType._id, title: eventType.title, description: eventType.description, length: eventType.length }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/public/:id - Public: fetch basic booking info for rescheduling
router.get('/public/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('eventTypeId', 'title length');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/public/:userId/:date - Public: fetch busy slots for a host on a specific day
router.get('/public/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const busySlots = await Booking.find({
      hostUserId: userId,
      status: { $ne: 'CANCELLED' },
      startTime: { $gte: startOfDay, $lte: endOfDay }
    }).select('startTime endTime');
    
    res.json(busySlots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/bookings/:id/reschedule – public: reschedule an existing booking
router.patch('/:id/reschedule', async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Missing time fields' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          startTime: new Date(startTime), 
          endTime: new Date(endTime),
          status: 'ACCEPTED' // Reset to accepted if it was cancelled/pending
        } 
      },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
