const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// ✅ Submit Application
router.post('/submit', applicationController.submitApplication);

// ✅ Get All Applications
router.get('/', applicationController.getAllApplications);

// ✅ Get Single Application
router.get('/:id', applicationController.getApplicationById);

// ✅ Get Applications by Job
router.get('/job/:jobId', applicationController.getApplicationsByJob);

// ✅ Get Applications by User
router.get('/user/:userId', applicationController.getApplicationsByUser);

// ✅ Update Application Status
router.put('/:id/status', applicationController.updateApplicationStatus);

// ✅ Withdraw Application
router.delete('/:id', applicationController.withdrawApplication);

module.exports = router;
