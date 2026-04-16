const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
  userId:               { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Core
  title:                { type: String, required: true, default: '15 Min Meeting' },
  slug:                 { type: String, required: true },
  description:          { type: String, default: '' },
  length:               { type: Number, required: true, default: 15 }, // minutes

  // Location
  locationType:         { type: String, enum: ['integrations:google:meet','integrations:zoom','integrations:daily','phone','link','inPerson',''], default: 'integrations:google:meet' },
  locationLink:         { type: String, default: '' },
  location:             { type: String, default: 'Google Meet' }, // friendly display

  // Visibility
  hidden:               { type: Boolean, default: false },
  requiresConfirmation: { type: Boolean, default: false },

  // Availability
  availabilityId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Availability', default: null },
  periodType:           { type: String, enum: ['ROLLING','RANGE','UNLIMITED'], default: 'UNLIMITED' },
  periodDays:           { type: Number, default: 60 },

  // Limits
  minimumBookingNotice: { type: Number, default: 120 }, // minutes
  beforeEventBuffer:    { type: Number, default: 0 },   // minutes
  afterEventBuffer:     { type: Number, default: 0 },

  // Customisation
  eventName:            { type: String, default: '' },
  currency:             { type: String, default: 'usd' },
  price:                { type: Number, default: 0 },
  requiresPayment:      { type: Boolean, default: false },

  // Custom questions/fields
  customInputs: [{
    type:        { type: String, enum: ['text','textLong','number','bool','radio','select'], default: 'text' },
    label:       { type: String },
    required:    { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    options:     [{ type: String }],
  }],

  // Scheduling
  disableGuests:        { type: Boolean, default: false },
  hideCalendarNotes:    { type: Boolean, default: false },
  successRedirectUrl:   { type: String, default: '' },
  teamId:               { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },

  // Metadata
  metadata:             { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

eventTypeSchema.index({ userId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('EventType', eventTypeSchema);
