const express   = require('express');
const router    = express.Router();
const auth      = require('../middleware/auth');
const Booking   = require('../models/Booking');
const EventType = require('../models/EventType');
const User      = require('../models/User');

// POST /api/bookings  – public: create a new booking
router.post('/', async (req, res) => {
  try {
    const { eventTypeId, attendeeName, attendeeEmail, attendeeTimezone, startTime, endTime, notes, userFieldsResponses } = req.body;
    if (!eventTypeId || !attendeeName || !attendeeEmail || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const eventType = await EventType.findById(eventTypeId);
    if (!eventType) return res.status(404).json({ message: 'Event type not found' });

    // Check for double booking
    const conflict = await Booking.findOne({
      hostUserId: eventType.userId,
      status: { $ne: 'CANCELLED' },
      startTime: { $lt: new Date(endTime) },
      endTime:   { $gt: new Date(startTime) },
    });
    if (conflict) return res.status(409).json({ message: 'This time slot is already booked.' });

    const host = await User.findById(eventType.userId);
    const booking = new Booking({
      eventTypeId,
      hostUserId:       eventType.userId,
      attendeeName,
      attendeeEmail,
      attendeeTimezone: attendeeTimezone || 'UTC',
      startTime:        new Date(startTime),
      endTime:          new Date(endTime),
      title:            `${attendeeName} <> ${host?.name || 'Host'}`,
      notes,
      location:         eventType.location || 'Google Meet',
      meetingUrl:       `https://meet.google.com/${Math.random().toString(36).slice(2,5)}-${Math.random().toString(36).slice(2,6)}-${Math.random().toString(36).slice(2,5)}`,
      status:           eventType.requiresConfirmation ? 'PENDING' : 'ACCEPTED',
      userFieldsResponses: userFieldsResponses || {},
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error('POST /bookings error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/bookings  – protected: list all bookings for the logged-in host
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ hostUserId: req.userId })
      .populate('eventTypeId', 'title length slug')
      .sort({ startTime: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('GET /bookings error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PUBLIC ROUTES ──────────────────────────────────────────────────────────────
// ORDER MATTERS: more specific paths MUST come before generic ones.

// GET /api/bookings/public/booking/:id  – single booking details (for reschedule page)
router.get('/public/booking/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('eventTypeId', 'title length');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    console.error('GET /public/booking/:id error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/public/slots/:userId/:date  – busy slots for a host on a specific day
// FIX: This was previously /public/:userId/:date which conflicted with /public/:username/:slug
router.get('/public/slots/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const busySlots = await Booking.find({
      hostUserId: userId,
      status:     { $ne: 'CANCELLED' },
      startTime:  { $gte: startOfDay, $lte: endOfDay },
    }).select('startTime endTime');

    res.json(busySlots);
  } catch (err) {
    console.error('GET /public/slots error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bookings/public/:username/:slug  – public booking page info
router.get('/public/:username/:slug', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const eventType = await EventType.findOne({
      userId: user._id,
      slug:   req.params.slug,
      hidden: false,
    });
    if (!eventType) return res.status(404).json({ message: 'Event type not found' });

    res.json({
      host:      { id: user._id, name: user.name, username: user.username, avatar: user.avatar, bio: user.bio },
      eventType: { id: eventType._id, title: eventType.title, description: eventType.description, length: eventType.length },
    });
  } catch (err) {
    console.error('GET /public/:username/:slug error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PROTECTED ROUTES (specific IDs) ───────────────────────────────────────────

// GET /api/bookings/:id
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

// PATCH /api/bookings/:id/cancel
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

// PATCH /api/bookings/:id/reschedule  – public
router.patch('/:id/reschedule', async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Missing time fields' });
    }
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { startTime: new Date(startTime), endTime: new Date(endTime), status: 'ACCEPTED' } },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
