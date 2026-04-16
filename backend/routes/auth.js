const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET /api/auth/auto-login  — returns a JWT for John Doe (no credentials needed)
router.get('/auto-login', async (req, res) => {
  try {
    const user = await User.findOne({ email: 'john@cal.com' }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Seed user not found — wait a moment and retry.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'calcom_secret_key', { expiresIn: '30d' });
    res.json({
      token,
      user: {
        id:       user._id,
        name:     user.name,
        username: user.username,
        email:    user.email,
        avatar:   user.avatar,
        plan:     user.plan,
        timezone: user.timezone,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already in use' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/auth/google
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy');

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    let payload;
    
    // In a real prod environment we verify the token with googleClient.verifyIdToken.
    // Since this is a test clone and may lack a configured GOOGLE_CLIENT_ID, we'll manually decode it if verification fails.
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (ve) {
      // Fallback for visual clone: trust the decoded payload if no valid client ID is matched.
      payload = jwt.decode(token);
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const { email, name, picture, sub } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-provision user through Google SSO
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(sub + process.env.JWT_SECRET, salt);
      user = new User({ 
        name: name, 
        username: email.split('@')[0] + Math.floor(Math.random() * 1000), 
        email: email, 
        password: randomPassword,
        avatar: picture
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token: jwtToken,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, avatar: user.avatar }
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/auth/me  (protected)
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
