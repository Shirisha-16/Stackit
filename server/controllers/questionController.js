const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Notification = require('../models/Notification');

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const question = new Question({
      title,
      description,
      tags,
      author: req.user.id
    });

    await question.save();
    await question.populate('author', 'username');

    res.status(201).json({
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all questions with pagination and filters
// @route   GET /api/questions
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const tag = req.query.tag;

    let query = { isActive: true };
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const questions = await Question.find(query)
      .populate('author', 'username')
      .populate('acceptedAnswer')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Get answer counts for each question
    const questionsWithCounts = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({ 
          question: question._id, 
          isActive: true 
        });
        return {
          ...question.toJSON(),
          answerCount
        };
      })
    );

    const total = await Question.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      questions: questionsWithCounts,
      currentPage: page,
      totalPages,
      totalQuestions: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get question by ID
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username')
      .populate('acceptedAnswer');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (only question author)
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, tags } = req.body;

    question.title = title || question.title;
    question.description = description || question.description;
    question.tags = tags || question.tags;

    await question.save();
    await question.populate('author', 'username');

    res.json({
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (only question author)
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    question.isActive = false;
    await question.save();

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote on a question
// @route   POST /api/questions/:id/vote
// @access  Private
const voteQuestion = async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user already voted
    const existingVote = question.votes.find(
      vote => vote.user.toString() === req.user.id
    );

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if same type
        question.votes = question.votes.filter(
          vote => vote.user.toString() !== req.user.id
        );
      } else {
        // Change vote type
        existingVote.type = type;
      }
    } else {
      // Add new vote
      question.votes.push({
        user: req.user.id,
        type
      });
    }

    await question.save();

    res.json({
      message: 'Vote updated successfully',
      voteCount: question.voteCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search questions
// @route   GET /api/questions/search
// @access  Public
const searchQuestions = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const questions = await Question.find({
      $text: { $search: q },
      isActive: true
    })
      .populate('author', 'username')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments({
      $text: { $search: q },
      isActive: true
    });

    res.json({
      questions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalQuestions: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  searchQuestions
};