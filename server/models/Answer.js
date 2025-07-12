// server/models/Answer.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['upvote', 'downvote']
    }
  }],
  isAccepted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for vote count
answerSchema.virtual('voteCount').get(function() {
  const upvotes = this.votes.filter(vote => vote.type === 'upvote').length;
  const downvotes = this.votes.filter(vote => vote.type === 'downvote').length;
  return upvotes - downvotes;
});

// Index for performance
answerSchema.index({ question: 1, createdAt: -1 });
answerSchema.index({ author: 1 });

answerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Answer', answerSchema);