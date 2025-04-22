const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB connected');
  
  try {
    // update all users
    const result = await User.updateMany(
      { displayOrder: { $exists: false } }, 
      { $set: { displayOrder: 0 } }
    );
    
    console.log(`Migration complete: ${result.modifiedCount} documents updated`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
})
.catch(err => console.error('MongoDB connection error:', err));