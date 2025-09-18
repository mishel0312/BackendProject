const mongoose = require('mongoose');

// Log schema for storing all request and endpoint logs
const logSchema = new mongoose.Schema(
  {
    level: { type: String, required: true },
    message: { type: String, required: true },
    // Capture useful request context
    method: { type: String },
    url: { type: String },
    endpoint: { type: String },
    statusCode: { type: Number },
    // Store any metadata as a free-form object
    meta: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('log', logSchema);


