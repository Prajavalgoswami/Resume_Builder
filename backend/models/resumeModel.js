import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  completion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  template: {
    theme: String,
    colorPalette: [String]
  },
  profileInfo : {
    profilePreviewUrl: String,
    fullName: String,
    designation: String
  },
  summary: {
    type: String,
    required: true
  },

  contactInfo: {
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String,
    website: String
  },
  experience: [{
    jobTitle: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    responsibilities: [{
      type: String,
      required: true
    }]
  }],
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    graduationDate: {
      type: Date,
      required: true
    }
  }],
  skills: [{
    name: { type: String, required: true },
    progress: { type: Number, required: true }
  }],
  projects: [{
    title: String,
    description: String,
    github: String,
    liveDemo: String
  }],

  certifications: [{
    title: String,
    authority: String,
    year: String
  }],

  languages: [{
    name: String,
    progress: Number
  }],
  interests: [{
    type: String
  }]
}, 
{ timestamps: true }
);

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

export default Resume;