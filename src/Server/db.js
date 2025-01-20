const mongoose = require('mongoose');
require('dotenv').config({ path: 'src/Server/utils/.env' }); // Ensure correct relative path

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    // Attempt connection
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    // Handle connection errors
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('Full Error:', err); // Optional, for detailed logging
    process.exit(1); // Exit process with failure
  }
};

// Export the connection function
module.exports = connectDB;
