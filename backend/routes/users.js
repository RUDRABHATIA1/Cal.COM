const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const User    = require('../models/User');

// GET /api/users/me  — get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/users/profile  — update name, bio, username, avatar
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, username, bio, avatar } = req.body;
    const update = {};
    if (name     !== undefined) update.name     = name;
    if (username !== undefined) update.username = username;
    if (bio      !== undefined) update.bio      = bio;
    if (avatar   !== undefined) update.avatar   = avatar;

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Username already taken' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/users/settings  — update locale, timezone, theme, appearance
router.put('/settings', auth, async (req, res) => {
  try {
    const {
      timezone, locale, timeFormat, weekStart,
      theme, brandColor, darkBrandColor, hideBranding,
      defaultScheduleId,
    } = req.body;
    const update = {};
    if (timezone         !== undefined) update.timezone         = timezone;
    if (locale           !== undefined) update.locale           = locale;
    if (timeFormat       !== undefined) update.timeFormat       = timeFormat;
    if (weekStart        !== undefined) update.weekStart        = weekStart;
    if (theme            !== undefined) update.theme            = theme;
    if (brandColor       !== undefined) update.brandColor       = brandColor;
    if (darkBrandColor   !== undefined) update.darkBrandColor   = darkBrandColor;
    if (hideBranding     !== undefined) update.hideBranding     = hideBranding;
    if (defaultScheduleId !== undefined) update.defaultScheduleId = defaultScheduleId;

    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/users/john  — get John's public profile (for auto-login)
router.get('/john', async (req, res) => {
  try {
    const user = await User.findOne({ email: 'john@cal.com' }).select('-password');
    if (!user) return res.status(404).json({ message: 'John not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
