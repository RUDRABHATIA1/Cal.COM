const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Team = require('../models/Team');

// GET /api/teams - Get all teams I am a member of
router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find({ 'members.user': req.userId })
      .populate('ownerId', 'name email')
      .populate('members.user', 'name username email');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/teams - Create a new team
router.post('/', auth, async (req, res) => {
  try {
    const { name, slug, bio } = req.body;
    if (!name || !slug) return res.status(400).json({ message: 'Name and slug are required' });

    const existing = await Team.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Team slug already exists' });

    const team = new Team({
      name,
      slug,
      bio,
      ownerId: req.userId,
      members: [{ user: req.userId, role: 'OWNER', accepted: true }]
    });

    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/teams/:id - Get specific team details
router.get('/:id', auth, async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id, 'members.user': req.userId })
      .populate('members.user', 'name username email');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
