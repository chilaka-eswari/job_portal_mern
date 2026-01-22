const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

// ✅ Create Job
router.post('/create', jobController.createJob);

// ✅ Get All Jobs
router.get('/', jobController.getAllJobs);

// ✅ Get Single Job
router.get('/:id', jobController.getJobById);

// ✅ Update Job
router.put('/:id', jobController.updateJob);

// ✅ Delete Job
router.delete('/:id', jobController.deleteJob);

// ✅ Search Jobs
router.get('/search/query', jobController.searchJobs);

// ✅ Get Jobs by User
router.get('/user/:userId', jobController.getJobsByUser);

module.exports = router;
