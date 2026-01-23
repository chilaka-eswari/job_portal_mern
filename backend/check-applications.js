require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Application = require('./models/Application');
const User = require('./models/User');
const Job = require('./models/Job');

const checkApplications = async () => {
  try {
    await connectDB();
    
    const count = await Application.countDocuments();
    console.log(`\n✅ Total Applications in Database: ${count}\n`);
    
    if (count === 0) {
      console.log('⚠️  No applications found.');
      process.exit(0);
    }
    
    const apps = await Application.find()
      .populate('applicant', 'firstName lastName email phone')
      .populate('job', 'title company location');
    
    console.log('📋 Applications:');
    apps.forEach((app, i) => {
      console.log(`\n${i + 1}. Application ID: ${app._id}`);
      console.log(`   Applicant: ${app.applicant.firstName} ${app.applicant.lastName}`);
      console.log(`   Email: ${app.applicant.email}`);
      console.log(`   Phone: ${app.applicant.phone}`);
      console.log(`   Job: ${app.job.title}`);
      console.log(`   Company: ${app.job.company}`);
      console.log(`   Location: ${app.job.location}`);
      console.log(`   Status: ${app.status}`);
      console.log(`   Applied At: ${app.appliedAt}`);
      console.log(`   Address: ${app.address}`);
      console.log(`   City: ${app.city}`);
      console.log(`   Education: ${app.education.length} entries`);
      console.log(`   Certifications: ${app.certifications.length} entries`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkApplications();
