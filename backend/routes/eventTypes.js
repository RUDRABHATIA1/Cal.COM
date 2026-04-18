const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const EventType = require('../models/EventType');

// GET /api/event-types  – list current user's event types
router.get('/', auth, async (req, res) => {
  try {
    const events = await EventType.find({ userId: req.userId }).sort({ position: 1, createdAt: -1 });
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

    const maxPos = await EventType.findOne({ userId: req.userId }).sort({ position: -1 });
    const position = maxPos ? maxPos.position + 1 : 0;

    const event = new EventType({ userId: req.userId, title, slug, description, length: length || 30, position });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Slug already exists for this user' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH /api/event-types/:id/reorder – swap position with neighbor
router.patch('/:id/reorder', auth, async (req, res) => {
  try {
    const { direction } = req.body; // 'up' or 'down'
    if (!['up', 'down'].includes(direction)) return res.status(400).json({ message: 'Invalid direction' });

    const all = await EventType.find({ userId: req.userId }).sort({ position: 1 });
    const idx = all.findIndex(e => e._id.toString() === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Event type not found' });

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= all.length) return res.status(400).json({ message: 'Cannot move further' });

    const current = all[idx];
    const neighbor = all[targetIdx];

    const tempPos = current.position;
    current.position = neighbor.position;
    neighbor.position = tempPos;

    await Promise.all([current.save(), neighbor.save()]);
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
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
