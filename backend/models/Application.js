const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
    resume: {
      type: String,
      required: [true, 'Resume is required'],
    },
    photo: String,
    education: [
      {
        educationType: String,
        course: String,
        college: String,
        score: String,
        universityRegNo: String,
      },
    ],
    certifications: [
      {
        name: String,
        proficiency: String,
        certNumber: String,
        issueDate: Date,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
