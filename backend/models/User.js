const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    userType: {
      type: String,
      enum: ['jobseeker', 'employer'],
      default: 'jobseeker',
    },
    profilePicture: {
      type: String,
      default: null,
    },
    resume: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    skills: [
      {
        type: String,
      },
    ],
    experience: [
      {
        jobTitle: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        field: String,
        graduationYear: Number,
      },
    ],
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
