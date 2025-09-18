const mongoose = require('mongoose');

/*
  Computed Pattern cache for monthly reports:
  - Keyed by userid, year, month
  - Stores 'costs' exactly in the required output format:
    [ { food: [...] }, { education: [...] }, { health: [] }, { housing: [] }, { sports: [] } ]
*/
const reportSchema = new mongoose.Schema(
  {
    userid: { type: Number, required: true, index: true },
    year:   { type: Number, required: true },
    month:  { type: Number, required: true },
    costs:  { type: Array,  required: true }, // see format above
  },
  { timestamps: true, collection: 'reports' }
);

reportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('report', reportSchema);
