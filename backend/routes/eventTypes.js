const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const EventType = require('../models/EventType');

// GET /api/event-types  – list current user's event types
router.get('/', auth, async (req, res) => {
  try {
    const events = await EventType.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/event-types/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await EventType.findOne({ _id: req.params.id, userId: req.userId });
    if (!event) return res.status(404).json({ message: 'Event type not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/event-types  – create a new event type
router.post('/', auth, async (req, res) => {
  try {
    const { title, slug, description, length } = req.body;
    if (!title || !slug) return res.status(400).json({ message: 'Title and slug are required' });

    const event = new EventType({ userId: req.userId, title, slug, description, length: length || 30 });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Slug already exists for this user' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/event-types/:id  – update
router.patch('/:id', auth, async (req, res) => {
  try {
    const event = await EventType.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: 'Event type not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/event-types/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await EventType.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!event) return res.status(404).json({ message: 'Event type not found' });
    res.json({ message: 'Event type deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
