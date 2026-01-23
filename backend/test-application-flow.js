require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Application = require('./models/Application');
const User = require('./models/User');
const Job = require('./models/Job');

const testApplicationFlow = async () => {
  try {
    console.log('\n🧪 TESTING APPLICATION SUBMISSION FLOW\n');
    console.log('='.repeat(60));
    
    await connectDB();

    // Step 1: Check existing data
    console.log('\n📊 STEP 1: Checking Existing Data');
    console.log('-'.repeat(60));
    
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const appCount = await Application.countDocuments();
    
    console.log(`   Users in DB: ${userCount}`);
    console.log(`   Jobs in DB: ${jobCount}`);
    console.log(`   Applications in DB: ${appCount}`);

    // Step 2: Get or create test user
    console.log('\n👤 STEP 2: Getting Test User');
    console.log('-'.repeat(60));
    
    let testUser = await User.findOne({ email: 'test.applicant@example.com' });
    if (!testUser) {
      console.log('   Creating new test user...');
      testUser = await User.create({
        firstName: 'John',
        lastName: 'Applicant',
        email: 'test.applicant@example.com',
        phone: '+1-555-9999',
        password: 'password123',
        userType: 'jobseeker',
      });
      console.log(`   ✅ User created: ${testUser._id}`);
    } else {
      console.log(`   ✅ User found: ${testUser._id}`);
    }

    // Step 3: Get a random job
    console.log('\n💼 STEP 3: Selecting a Job');
    console.log('-'.repeat(60));
    
    const job = await Job.findOne().limit(1);
    if (!job) {
      console.log('   ❌ No jobs found. Please run: npm run seed');
      process.exit(1);
    }
    console.log(`   ✅ Selected Job: ${job.title}`);
    console.log(`   Company: ${job.company}`);

    // Step 4: Check if already applied
    console.log('\n🔍 STEP 4: Checking for Duplicate Application');
    console.log('-'.repeat(60));
    
    const existingApp = await Application.findOne({ 
      applicant: testUser._id, 
      job: job._id 
    });
    
    if (existingApp) {
      console.log('   ⚠️  Already applied. Skipping submission.');
      console.log(`   Application ID: ${existingApp._id}`);
      console.log(`   Status: ${existingApp.status}`);
    } else {
      // Step 5: Create new application
      console.log('\n📝 STEP 5: Creating New Application');
      console.log('-'.repeat(60));
      
      const newApplication = await Application.create({
        applicant: testUser._id,
        job: job._id,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone,
        address: '456 Test Street',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        pincode: '90001',
        resume: 'test-resume.pdf',
        education: [
          {
            educationType: 'Bachelors',
            course: 'Computer Science',
            college: 'Test University',
            score: '3.7',
            universityRegNo: 'TEST12345',
          },
        ],
        certifications: [
          {
            name: 'Cloud Practitioner',
            proficiency: 'Intermediate',
            certNumber: 'AWS-CP-123',
            issueDate: new Date('2025-06-15'),
          },
        ],
      });
      
      console.log('   ✅ Application created successfully!');
      console.log(`   Application ID: ${newApplication._id}`);
      console.log(`   Status: ${newApplication.status}`);

      // Step 6: Update job's applications array
      console.log('\n🔗 STEP 6: Linking Application to Job');
      console.log('-'.repeat(60));
      
      job.applications.push(newApplication._id);
      await job.save();
      console.log(`   ✅ Added application to job's applications array`);

      // Step 7: Update user's applied jobs
      console.log('\n🔗 STEP 7: Linking Application to User');
      console.log('-'.repeat(60));
      
      testUser.appliedJobs.push(newApplication._id);
      await testUser.save();
      console.log(`   ✅ Added application to user's appliedJobs array`);
    }

    // Step 8: Verify data
    console.log('\n✅ STEP 8: Verifying Data in Database');
    console.log('-'.repeat(60));
    
    const totalApplications = await Application.countDocuments();
    const userApplications = await Application.countDocuments({ applicant: testUser._id });
    const jobApplications = await Application.countDocuments({ job: job._id });
    
    console.log(`   Total Applications in DB: ${totalApplications}`);
    console.log(`   Applications by this user: ${userApplications}`);
    console.log(`   Applications for this job: ${jobApplications}`);

    // Step 9: Display all applications
    console.log('\n📋 STEP 9: All Applications in Database');
    console.log('-'.repeat(60));
    
    const allApps = await Application.find()
      .populate('applicant', 'firstName lastName email')
      .populate('job', 'title company')
      .limit(10);
    
    allApps.forEach((app, idx) => {
      console.log(`\n   ${idx + 1}. ${app.applicant.firstName} → ${app.job.title}`);
      console.log(`      ID: ${app._id}`);
      console.log(`      Status: ${app.status}`);
      console.log(`      Applied: ${new Date(app.appliedAt).toLocaleDateString()}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST COMPLETED SUCCESSFULLY!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
};

testApplicationFlow();
