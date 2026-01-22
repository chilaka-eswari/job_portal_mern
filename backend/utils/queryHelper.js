const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// ✅ Get all users with essential info
exports.getAllUsersForDisplay = async () => {
  try {
    return await User.find().select('-password').lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get user with full details
exports.getUserWithDetails = async (userId) => {
  try {
    return await User.findById(userId)
      .select('-password')
      .populate('appliedJobs')
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get all jobs with employer info
exports.getAllJobsForDisplay = async (filters = {}) => {
  try {
    const query = { status: 'open', ...filters };
    return await Job.find(query)
      .populate('postedBy', 'firstName lastName email phone')
      .select('-applications')
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get job details with all info
exports.getJobWithDetails = async (jobId) => {
  try {
    return await Job.findById(jobId)
      .populate('postedBy', 'firstName lastName email phone company')
      .populate('applications')
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get jobs by user type (Employer's posted jobs)
exports.getEmployerJobs = async (employerId) => {
  try {
    return await Job.find({ postedBy: employerId })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Search jobs
exports.searchJobsByKeyword = async (keyword) => {
  try {
    return await Job.find({
      status: 'open',
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } },
      ],
    })
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get jobs by filters (location, jobType, experience)
exports.filterJobs = async (filters) => {
  try {
    const query = { status: 'open' };
    
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }
    if (filters.jobType) {
      query.jobType = filters.jobType;
    }
    if (filters.experience) {
      query.experience = filters.experience;
    }
    if (filters.minSalary) {
      query['salary.min'] = { $gte: filters.minSalary };
    }

    return await Job.find(query)
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get user applications
exports.getUserApplications = async (userId) => {
  try {
    return await Application.find({ applicant: userId })
      .populate('job', 'title company location salary jobType')
      .populate('applicant', 'firstName lastName email phone')
      .sort({ appliedAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get job applications for employer
exports.getJobApplications = async (jobId) => {
  try {
    return await Application.find({ job: jobId })
      .populate('applicant', 'firstName lastName email phone')
      .populate('job', 'title company')
      .sort({ appliedAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get application statistics
exports.getApplicationStats = async (jobId) => {
  try {
    const applications = await Application.find({ job: jobId });
    const statuses = {
      pending: applications.filter(app => app.status === 'pending').length,
      reviewed: applications.filter(app => app.status === 'reviewed').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
    };
    
    return {
      total: applications.length,
      ...statuses,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get trending jobs (most applied)
exports.getTrendingJobs = async (limit = 10) => {
  try {
    return await Job.find({ status: 'open' })
      .populate('postedBy', 'firstName lastName email')
      .sort({ 'applications': -1 })
      .limit(limit)
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get jobs by skill
exports.getJobsBySkill = async (skill) => {
  try {
    return await Job.find({
      status: 'open',
      skills: { $in: [new RegExp(skill, 'i')] },
    })
      .populate('postedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Get dashboard statistics
exports.getDashboardStats = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments({ status: 'open' });
    const totalApplications = await Application.countDocuments();
    const jobseekers = await User.countDocuments({ userType: 'jobseeker' });
    const employers = await User.countDocuments({ userType: 'employer' });

    return {
      totalUsers,
      totalJobs,
      totalApplications,
      jobseekers,
      employers,
      timestamp: new Date(),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
