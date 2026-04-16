const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Availability = require('../models/Availability');

// ── helpers ─────────────────────────────────────────────────────────────────
const DEFAULT_DAYS = [
  { day: 'Sunday',    enabled: false, startTime: '09:00', endTime: '17:00' },
  { day: 'Monday',    enabled: true,  startTime: '09:00', endTime: '17:00' },
  { day: 'Tuesday',   enabled: true,  startTime: '09:00', endTime: '17:00' },
  { day: 'Wednesday', enabled: true,  startTime: '09:00', endTime: '17:00' },
  { day: 'Thursday',  enabled: true,  startTime: '09:00', endTime: '17:00' },
  { day: 'Friday',    enabled: true,  startTime: '09:00', endTime: '17:00' },
  { day: 'Saturday',  enabled: false, startTime: '09:00', endTime: '17:00' },
];

// Ensure every user has at least one "Working hours" default schedule
async function ensureDefault(userId) {
  const count = await Availability.countDocuments({ userId });
  if (count === 0) {
    await Availability.create({
      userId,
      name: 'Working hours',
      isDefault: true,
      timezone: 'Europe/London',
      days: DEFAULT_DAYS,
    });
  }
}

// ── GET /api/availability  — list all schedules ──────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    await ensureDefault(req.userId);
    const schedules = await Availability.find({ userId: req.userId }).sort({ createdAt: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /api/availability  — create a new schedule ──────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const schedule = await Availability.create({
      userId: req.userId,
      name: name || 'New schedule',
      isDefault: false,
      timezone: 'Europe/London',
      days: DEFAULT_DAYS,
    });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/availability/:id  — get one schedule ────────────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    const schedule = await Availability.findOne({ _id: req.params.id, userId: req.userId });
    if (!schedule) return res.status(404).json({ message: 'Not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PATCH /api/availability/:id  — update a schedule ─────────────────────────
router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, isDefault, timezone, days, overrides } = req.body;

    // If setting this as default, unset all others first
    if (isDefault) {
      await Availability.updateMany({ userId: req.userId }, { isDefault: false });
    }

    const schedule = await Availability.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...(name      !== undefined && { name }),
        ...(isDefault !== undefined && { isDefault }),
        ...(timezone  !== undefined && { timezone }),
        ...(days      !== undefined && { days }),
        ...(overrides !== undefined && { overrides }),
      },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── DELETE /api/availability/:id  — delete a schedule ────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const count = await Availability.countDocuments({ userId: req.userId });
    if (count <= 1) return res.status(400).json({ message: 'Cannot delete the only schedule' });
    await Availability.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/availability/public/:userId  — for booking page ─────────────────
router.get('/public/:userId', async (req, res) => {
  try {
    const schedule = await Availability.findOne({ userId: req.params.userId, isDefault: true })
      || await Availability.findOne({ userId: req.params.userId });
    if (!schedule) return res.status(404).json({ message: 'Not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
