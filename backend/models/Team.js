const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  slug:         { type: String, required: true, unique: true },
  logo:         { type: String, default: '' },
  bio:          { type: String, default: '' },
  hideBranding: { type: Boolean, default: false },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role:   { type: String, enum: ['OWNER','ADMIN','MEMBER'], default: 'MEMBER' },
    accepted: { type: Boolean, default: false },
  }],
  metadata:     { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
