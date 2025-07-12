const express = require('express');
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  searchQuestions
} = require('../controllers/questionController');
const {authMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post('/', authMiddleware, createQuestion);

// @route   GET /api/questions
// @desc    Get all questions with pagination and filters
// @access  Public
router.get('/', getQuestions);

// @route   GET /api/questions/search
// @desc    Search questions
// @access  Public
router.get('/search', searchQuestions);

// @route   GET /api/questions/:id
// @desc    Get question by ID
// @access  Public
router.get('/:id', getQuestionById);

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Private (only question author)
router.put('/:id', authMiddleware, updateQuestion);

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private (only question author)
router.delete('/:id', authMiddleware, deleteQuestion);

// @route   POST /api/questions/:id/vote
// @desc    Vote on a question
// @access  Private
router.post('/:id/vote', authMiddleware, voteQuestion);

module.exports = router;