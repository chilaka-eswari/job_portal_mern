const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// ✅ Submit Job Application
exports.submitApplication = async (req, res) => {
  try {
    const { applicant, job, firstName, lastName, email, phone, address, city, state, country, pincode, resume, photo, education, certifications } = req.body;

    // Check if job exists
    const jobExists = await Job.findById(job);
    if (!jobExists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user already applied
    const alreadyApplied = await Application.findOne({ applicant, job });
    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const application = new Application({
      applicant,
      job,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      country,
      pincode,
      resume,
      photo,
      education,
      certifications,
    });

    await application.save();

    // Add application to job
    jobExists.applications.push(application._id);
    await jobExists.save();

    // Add to user's applied jobs
    await User.findByIdAndUpdate(applicant, {
      $push: { appliedJobs: application._id },
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'firstName lastName email phone')
      .populate('job', 'title company location')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Applications by Job
exports.getApplicationsByJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'firstName lastName email phone')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Applications by User
exports.getApplicationsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const applications = await Application.find({ applicant: userId })
      .populate('job', 'title company location salary jobType')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Single Application
exports.getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId)
      .populate('applicant')
      .populate('job');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({
      application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Application Status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status, notes },
      { new: true, runValidators: true }
    ).populate('applicant').populate('job');

    res.status(200).json({
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Withdraw Application
exports.withdrawApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application = await Application.findByIdAndDelete(applicationId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Remove from job applications
    await Job.findByIdAndUpdate(application.job, {
      $pull: { applications: applicationId },
    });

    // Remove from user applied jobs
    await User.findByIdAndUpdate(application.applicant, {
      $pull: { appliedJobs: applicationId },
    });

    res.status(200).json({
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
