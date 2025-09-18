const mongoose = require('mongoose');

// Connect to MongoDB Atlas using MONGODB_URI from environment
// Short comments above code lines per style guide
async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }

  // Use mongoose connection with recommended options
  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });
}

module.exports = { connectToDatabase };


