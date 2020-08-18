const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    company: {
      type: String,
      required: true
    },
    website: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    skills: {
      type: [String],
      required: true
    },
    bio: {
      type: [String],
      required: true
    },
    githubUsername: {
      type: [String],
      required: true
    },
    experience: [{
      title: {
        type: String,
      },
      company: {
        type: String,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
      },
      description: {
        type: String,
      }
    }],
    social: {
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      facebook: {
        type: String,
      },
      linkedin: {
        type: Date,
      },
      instagram: {
        type: String,
      }

    },
  },
  {
    timestamps: true
  }
);

module.exports = Profile = mongoose.model('profile', ProfileSchema);
