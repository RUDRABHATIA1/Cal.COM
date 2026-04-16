const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:           { type: String, required: true, unique: true, trim: true },
  email:              { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:           { type: String, required: true },
  name:               { type: String, required: true },
  avatar:             { type: String, default: '' },
  bio:                { type: String, default: '' },

  // Locale & time
  timezone:           { type: String, default: 'Asia/Kolkata' },
  locale:             { type: String, default: 'en' },
  timeFormat:         { type: Number, enum: [12, 24], default: 12 },
  weekStart:          { type: String, enum: ['Sunday','Monday','Saturday'], default: 'Sunday' },

  // Appearance
  theme:              { type: String, enum: ['dark','light','system'], default: 'dark' },
  brandColor:         { type: String, default: '#0ea5e9' },
  darkBrandColor:     { type: String, default: '#0ea5e9' },
  hideBranding:       { type: Boolean, default: false },

  // Account
  plan:               { type: String, enum: ['FREE','PRO','TEAMS','ENTERPRISE'], default: 'PRO' },
  completedOnboarding:{ type: Boolean, default: true },
  defaultScheduleId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Availability', default: null },

  // Allow impersonation
  allowDynamicBooking: { type: Boolean, default: true },

  // Metadata
  metadata:           { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
