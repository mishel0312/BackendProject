const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    birthday: { type: Date, required: false },
  },
  { collection: 'users', timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
