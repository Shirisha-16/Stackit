import React, { useState, useContext } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import { createAnswer } from '../../api/answers';

const AnswerForm = ({ questionId, onAnswerSubmitted }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(useAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please provide an answer');
      return;
    }

    if (!user) {
      setError('Please login to submit an answer');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const answerData = {
        content,
        questionId,
        author: user._id
      };

      const newAnswer = await createAnswer(answerData);
      
      // Clear form
      setContent('');
      
      // Notify parent component
      if (onAnswerSubmitted) {
        onAnswerSubmitted(newAnswer);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="answer-form-container">
        <p className="login-prompt">
          Please <a href="/auth">login</a> to submit an answer.
        </p>
      </div>
    );
  }

  return (
    <div className="answer-form-container">
      <h3>Submit Your Answer</h3>
      
      <form onSubmit={handleSubmit} className="answer-form">
        <div className="form-group">
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your answer here..."
            className="answer-editor"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting || !content.trim()}
            className="submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;