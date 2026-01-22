require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');

const testConnection = async () => {
  try {
    console.log('🔍 Testing database connection...');
    await connectDB();
    
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    
    console.log(`✅ Database connected!`);
    console.log(`👥 Total users: ${userCount}`);
    console.log(`💼 Total jobs: ${jobCount}`);
    
    if (userCount === 0 || jobCount === 0) {
      console.log('⚠️  No data found. Run: npm run seed');
    } else {
      console.log('✨ Database is populated and ready!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testConnection();
