const mongoose = require('mongoose');

// Allowed categories checklist
const CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

const costSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES },
    userid: { type: Number, required: true },
    
    sum: { type: Number, required: true, min: 0 },
    // Created date can come from user or the server; default is to now
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('cost', costSchema);
