const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  uid:              { type: String, unique: true, sparse: true }, // public booking UID
  eventTypeId:      { type: mongoose.Schema.Types.ObjectId, ref: 'EventType', required: true },
  hostUserId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Attendee
  attendeeName:     { type: String, required: true },
  attendeeEmail:    { type: String, required: true, lowercase: true, trim: true },
  attendeeTimezone: { type: String, default: 'UTC' },
  attendeeLocale:   { type: String, default: 'en' },
  attendeePhone:    { type: String, default: '' },

  // Time
  startTime:        { type: Date, required: true },
  endTime:          { type: Date, required: true },

  // Content
  title:            { type: String, default: '' }, // e.g. "John Smith <> Jane Doe"
  description:      { type: String, default: '' },
  notes:            { type: String, default: '' },    // attendee notes
  userFieldsResponses: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Status
  status: {
    type: String,
    enum: ['PENDING','ACCEPTED','CANCELLED','RESCHEDULED','AWAITING_HOST'],
    default: 'ACCEPTED'
  },
  cancellationReason: { type: String, default: '' },
  rejectionReason:    { type: String, default: '' },
  rescheduled:        { type: Boolean, default: false },
  fromReschedule:     { type: String, default: '' }, // uid of original booking

  // Meeting
  location:         { type: String, default: '' },
  meetingUrl:       { type: String, default: '' },

  // Reminders / payments
  paid:             { type: Boolean, default: false },
  payment:          [{ type: mongoose.Schema.Types.Mixed }],

  // Metadata
  metadata:         { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

// Auto-generate uid before save
bookingSchema.pre('save', function(next) {
  if (!this.uid) {
    this.uid = require('crypto').randomBytes(8).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
