require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Application = require('./models/Application');
const User = require('./models/User');
const Job = require('./models/Job');

const testApplicationSubmission = async () => {
  try {
    console.log('🧪 Testing Application Submission...');
    await connectDB();

    // Get or create a user
    let user = await User.findOne();
    if (!user) {
      console.log('Creating test user...');
      user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0101',
        password: 'password123',
        userType: 'jobseeker',
      });
    }

    // Get a job
    let job = await Job.findOne();
    if (!job) {
      console.log('❌ No jobs found in database. Run: npm run seed');
      process.exit(1);
    }

    console.log(`\n📋 Test Data:`);
    console.log(`   User: ${user.firstName} ${user.lastName}`);
    console.log(`   Job: ${job.title} at ${job.company}`);

    // Check if application already exists
    const existingApp = await Application.findOne({ applicant: user._id, job: job._id });
    if (existingApp) {
      console.log('⚠️  Application already exists. Testing GET...');
      const app = await Application.findById(existingApp._id)
        .populate('applicant', 'firstName lastName email')
        .populate('job', 'title company');
      console.log('\n✅ Found Application:');
      console.log(`   ID: ${app._id}`);
      console.log(`   Applicant: ${app.applicant.firstName} ${app.applicant.lastName}`);
      console.log(`   Job: ${app.job.title}`);
      console.log(`   Status: ${app.status}`);
      process.exit(0);
    }

    // Create test application
    const applicationData = {
      applicant: user._id,
      job: job._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      pincode: '10001',
      resume: 'resume.pdf',
      education: [
        {
          educationType: 'Bachelors',
          course: 'Computer Science',
          college: 'State University',
          score: '3.8',
          universityRegNo: 'REG123456',
        },
      ],
      certifications: [
        {
          name: 'AWS Solutions Architect',
          proficiency: 'Advanced',
          certNumber: 'CERT123',
          issueDate: new Date('2024-01-15'),
        },
      ],
    };

    const newApplication = await Application.create(applicationData);
    console.log('\n✅ Application Created Successfully!');
    console.log(`   Application ID: ${newApplication._id}`);
    console.log(`   Status: ${newApplication.status}`);
    console.log(`   Applied At: ${newApplication.appliedAt}`);

    // Add to job's applications
    job.applications.push(newApplication._id);
    await job.save();

    // Add to user's applied jobs
    user.appliedJobs.push(newApplication._id);
    await user.save();

    console.log('\n✅ References updated in Job and User documents');

    // Fetch and display
    const fetchedApp = await Application.findById(newApplication._id)
      .populate('applicant', 'firstName lastName email')
      .populate('job', 'title company');

    console.log('\n📊 Fetched Application:');
    console.log(`   Applicant: ${fetchedApp.applicant.firstName} ${fetchedApp.applicant.lastName}`);
    console.log(`   Email: ${fetchedApp.applicant.email}`);
    console.log(`   Job: ${fetchedApp.job.title} at ${fetchedApp.job.company}`);
    console.log(`   Status: ${fetchedApp.status}`);

    // Show all applications
    const allApps = await Application.countDocuments();
    console.log(`\n📈 Total Applications in DB: ${allApps}`);

    console.log('\n✨ Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testApplicationSubmission();
