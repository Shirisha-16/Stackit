import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import { createQuestion } from '../../api/questions';
import { X } from 'lucide-react';

const AskQuestionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    }
    
    if (tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const questionData = {
        title: title.trim(),
        description: description.trim(),
        tags,
        author: user._id
      };

      const newQuestion = await createQuestion(questionData);
      
      // Navigate to the new question page
      navigate(`/questions/${newQuestion._id}`);
      
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to create question'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!user) {
    return (
      <div className="ask-question-container">
        <div className="login-required">
          <h2>Login Required</h2>
          <p>You need to be logged in to ask a question.</p>
          <button onClick={() => navigate('/auth')} className="login-btn">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ask-question-container">
      <div className="ask-question-header">
        <h1>Ask a Question</h1>
        <p>Get help from the community by asking a detailed question.</p>
      </div>

      <form onSubmit={handleSubmit} className="ask-question-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your programming question? Be specific."
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
          <small className="helper-text">
            Be specific and imagine you're asking a question to another person.
          </small>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Provide details about your question. Include what you've tried and what you're expecting."
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
          <small className="helper-text">
            Include all the information someone would need to answer your question.
          </small>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags">Tags *</label>
          <div className="tags-container">
            <div className="tags-list">
              {tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag-btn"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter or comma to add)"
              className={errors.tags ? 'error' : ''}
              disabled={tags.length >= 5}
            />
          </div>
          {errors.tags && <span className="error-text">{errors.tags}</span>}
          <small className="helper-text">
            Add up to 5 tags to describe what your question is about (e.g., javascript, react, html).
          </small>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Posting...' : 'Post Question'}
          </button>
        </div>

        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}
      </form>
    </div>
  );
};

export default AskQuestionForm;