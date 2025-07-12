const express = require('express');
const {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer
} = require('../controllers/answerController');
const {authMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/answers
// @desc    Create a new answer
// @access  Private
router.post('/', authMiddleware, createAnswer);

// @route   GET /api/answers/question/:questionId
// @desc    Get all answers for a question
// @access  Public
router.get('/question/:questionId', getAnswersByQuestion);

// @route   PUT /api/answers/:id
// @desc    Update answer
// @access  Private (only answer author)
router.put('/:id', authMiddleware, updateAnswer);

// @route   DELETE /api/answers/:id
// @desc    Delete answer
// @access  Private (only answer author)
router.delete('/:id', authMiddleware, deleteAnswer);

// @route   POST /api/answers/:id/vote
// @desc    Vote on an answer
// @access  Private
router.post('/:id/vote', authMiddleware, voteAnswer);

// @route   POST /api/answers/:id/accept
// @desc    Accept an answer
// @access  Private (only question author)
router.post('/:id/accept', authMiddleware, acceptAnswer);

module.exports = router;