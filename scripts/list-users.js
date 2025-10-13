const mongoose = require('mongoose');
require('dotenv').config();

async function listUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get all users (without password hashes for security)
    const User = require('../src/models/User');
    const users = await User.find({}, { password: 0 });
    
    console.log('\n📋 Users in database:');
    console.log(JSON.stringify(users, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

listUsers();
