const express = require('express');
const router = express.Router();
const queryHelper = require('../utils/queryHelper');

// ✅ Get Dashboard Statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await queryHelper.getDashboardStats();
    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Users (Display)
router.get('/users', async (req, res) => {
  try {
    const users = await queryHelper.getAllUsersForDisplay();
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Jobs (Display with filters)
router.get('/jobs', async (req, res) => {
  try {
    const { location, jobType, experience, minSalary } = req.query;
    
    let jobs;
    if (location || jobType || experience || minSalary) {
      jobs = await queryHelper.filterJobs({
        location,
        jobType,
        experience,
        minSalary: minSalary ? parseInt(minSalary) : null,
      });
    } else {
      jobs = await queryHelper.getAllJobsForDisplay();
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Job Details
router.get('/jobs/:jobId', async (req, res) => {
  try {
    const job = await queryHelper.getJobWithDetails(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Search Jobs
router.get('/search/jobs', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ error: 'Search keyword is required' });
    }
    const jobs = await queryHelper.searchJobsByKeyword(keyword);
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Jobs by Skill
router.get('/jobs-by-skill/:skill', async (req, res) => {
  try {
    const { skill } = req.params;
    const jobs = await queryHelper.getJobsBySkill(skill);
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Trending Jobs
router.get('/trending-jobs', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const jobs = await queryHelper.getTrendingJobs(parseInt(limit));
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get User Details
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await queryHelper.getUserWithDetails(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get User Applications
router.get('/user/:userId/applications', async (req, res) => {
  try {
    const applications = await queryHelper.getUserApplications(req.params.userId);
    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Job Applications (for Employer)
router.get('/job/:jobId/applications', async (req, res) => {
  try {
    const applications = await queryHelper.getJobApplications(req.params.jobId);
    const stats = await queryHelper.getApplicationStats(req.params.jobId);
    
    res.status(200).json({
      success: true,
      count: applications.length,
      stats,
      applications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Employer's Posted Jobs
router.get('/employer/:employerId/jobs', async (req, res) => {
  try {
    const jobs = await queryHelper.getEmployerJobs(req.params.employerId);
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
