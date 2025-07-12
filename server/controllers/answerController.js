const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Notification = require('../models/Notification');

// @desc    Create a new answer
// @route   POST /api/answers
// @access  Private
const createAnswer = async (req, res) => {
  try {
    const { content, questionId } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = new Answer({
      content,
      question: questionId,
      author: req.user.id
    });

    await answer.save();
    await answer.populate('author', 'username');

    // Create notification for question author
    if (question.author.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: question.author,
        sender: req.user.id,
        type: 'answer',
        message: `Someone answered your question: "${question.title}"`,
        relatedQuestion: questionId,
        relatedAnswer: answer._id
      });
      await notification.save();
    }

    res.status(201).json({
      message: 'Answer created successfully',
      answer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all answers for a question
// @route   GET /api/answers/question/:questionId
// @access  Public
const getAnswersByQuestion = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const answers = await Answer.find({
      question: req.params.questionId,
      isActive: true
    })
      .populate('author', 'username')
      .sort({ isAccepted: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Answer.countDocuments({
      question: req.params.questionId,
      isActive: true
    });

    res.json({
      answers,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAnswers: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:id
// @access  Private (only answer author)
const updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { content } = req.body;
    answer.content = content || answer.content;

    await answer.save();
    await answer.populate('author', 'username');

    res.json({
      message: 'Answer updated successfully',
      answer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private (only answer author)
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    answer.isActive = false;
    await answer.save();

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Vote on an answer
// @route   POST /api/answers/:id/vote
// @access  Private
const voteAnswer = async (req, res) => {
  try {
    const { type } = req.body; // 'upvote' or 'downvote'
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user already voted
    const existingVote = answer.votes.find(
      vote => vote.user.toString() === req.user.id
    );

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if same type
        answer.votes = answer.votes.filter(
          vote => vote.user.toString() !== req.user.id
        );
      } else {
        // Change vote type
        existingVote.type = type;
      }
    } else {
      // Add new vote
      answer.votes.push({
        user: req.user.id,
        type
      });
    }

    await answer.save();

    res.json({
      message: 'Vote updated successfully',
      voteCount: answer.voteCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept an answer
// @route   POST /api/answers/:id/accept
// @access  Private (only question author)
const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const question = await Question.findById(answer.question);
    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only question author can accept answers' });
    }

    // Unaccept previous accepted answer
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    // Accept this answer
    answer.isAccepted = true;
    await answer.save();

    // Update question
    question.acceptedAnswer = answer._id;
    await question.save();

    // Create notification for answer author
    if (answer.author.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: answer.author,
        sender: req.user.id,
        type: 'accept',
        message: `Your answer was accepted for: "${question.title}"`,
        relatedQuestion: question._id,
        relatedAnswer: answer._id
      });
      await notification.save();
    }

    res.json({
      message: 'Answer accepted successfully',
      answer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAnswer,
  getAnswersByQuestion,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer
};