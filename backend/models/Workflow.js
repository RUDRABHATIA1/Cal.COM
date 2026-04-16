const mongoose = require('mongoose');

const workflowStepSchema = new mongoose.Schema({
  stepNumber:    { type: Number, required: true },
  action:        { type: String, enum: ['EMAIL','SMS','WHATSAPP','PHONE_CALL'], default: 'EMAIL' },
  trigger:       { type: String, enum: ['BEFORE_EVENT','AFTER_EVENT','NEW_EVENT','CANCELLED','RESCHEDULED'], default: 'NEW_EVENT' },
  time:          { type: Number, default: 24 },         // hours
  timeUnit:      { type: String, enum: ['HOUR','MINUTE','DAY','WEEK'], default: 'HOUR' },
  sendTo:        { type: String, enum: ['ATTENDEE','HOST','ALL_ATTENDEES'], default: 'ATTENDEE' },
  reminderBody:  { type: String, default: '' },
  emailSubject:  { type: String, default: '' },
  template:      { type: String, enum: ['CUSTOM','REMINDER','CANCELLED_EVENT','COMPLETED_WORKFLOW'], default: 'REMINDER' },
  sender:        { type: String, default: 'Cal.com' },
  numberRequired:{ type: Boolean, default: false },
  includeCalendarEvent: { type: Boolean, default: false },
}, { _id: false });

const workflowSchema = new mongoose.Schema({
  name:     { type: String, default: 'Untitled Workflow' },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  trigger:  { type: String, enum: ['BEFORE_EVENT','AFTER_EVENT','NEW_EVENT','CANCELLED','RESCHEDULED_EVENT','NO_SHOW'], default: 'NEW_EVENT' },
  time:     { type: Number, default: 0 },
  timeUnit: { type: String, enum: ['HOUR','MINUTE','DAY','WEEK'], default: 'HOUR' },
  steps:    { type: [workflowStepSchema], default: [] },
  activeOn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventType' }],
}, { timestamps: true });

module.exports = mongoose.model('Workflow', workflowSchema);
