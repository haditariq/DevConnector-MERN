const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    avatar: {
      type: String,
      required: true
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId
        }
      }
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        text: {
          type: String
        },
        name: {
          type: String
        },
        avatar: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          default: Date.now()
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = Post = mongoose.model('post', PostSchema);
