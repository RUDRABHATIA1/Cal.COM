const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
  day:       { type: String, required: true },
  enabled:   { type: Boolean, default: true },
  startTime: { type: String, default: '09:00' },
  endTime:   { type: String, default: '17:00' },
}, { _id: false });

const OverrideSchema = new mongoose.Schema({
  date:      { type: String, required: true }, // 'YYYY-MM-DD'
  startTime: { type: String, default: '09:00' },
  endTime:   { type: String, default: '17:00' },
  isOff:     { type: Boolean, default: false },
}, { _id: false });

const AvailabilitySchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:      { type: String, default: 'Working hours' },
  isDefault: { type: Boolean, default: false },
  timezone:  { type: String, default: 'Europe/London' },
  days: {
    type: [DaySchema],
    default: [
      { day: 'Sunday',    enabled: false, startTime: '09:00', endTime: '17:00' },
      { day: 'Monday',    enabled: true,  startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday',   enabled: true,  startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', enabled: true,  startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday',  enabled: true,  startTime: '09:00', endTime: '17:00' },
      { day: 'Friday',    enabled: true,  startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday',  enabled: false, startTime: '09:00', endTime: '17:00' },
    ]
  },
  overrides: { type: [OverrideSchema], default: [] },
}, { timestamps: true });

// Compound unique index: one schedule per user per name
AvailabilitySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Availability', AvailabilitySchema);
