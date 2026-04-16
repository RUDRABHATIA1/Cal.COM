const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Auth middleware — "No Login Required" mode.
 * If a valid JWT is provided, use it.
 * If not, automatically fall back to the default seed user (John Doe).
 * This ensures all dashboard API calls work without any login.
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Try JWT if provided
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'calcom_secret_key');
      req.userId = decoded.userId;
      return next();
    } catch (err) {
      // Token is invalid/expired — fall through to fallback
    }
  }

  // 2. No valid token — fall back to the default user (John Doe)
  try {
    const defaultUser = await User.findOne({ email: 'john@cal.com' });
    if (defaultUser) {
      req.userId = defaultUser._id;
      return next();
    }
  } catch (err) {
    // DB error — continue to 401
  }

  res.status(401).json({ message: 'No token, authorization denied' });
};
