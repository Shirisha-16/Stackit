import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getQuestion, voteQuestion } from '../api/questions';
import { getAnswers } from '../api/answers';
import AnswerList from '../components/Answers/AnswerList';
import AnswerForm from '../components/Answers/AnswerForm';
import { ChevronUp, ChevronDown, Eye, Clock, User, Tag, ArrowLeft } from 'lucide-react';

const QuestionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Fixed: Use the hook instead of useContext
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingError, setVotingError] = useState('');

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setLoading(true);
        
        // Fetch question details
        const questionData = await getQuestion(id);
        setQuestion(questionData);
        
        // Fetch answers
        const answersData = await getAnswers(id);
        setAnswers(answersData);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndAnswers();
  }, [id]); // Now only depends on id

  const handleVote = async (voteType) => {
    if (!user) {
      navigate('/auth?from=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      setVotingError('');
      const updatedQuestion = await voteQuestion(id, voteType);
      setQuestion(updatedQuestion);
    } catch (err) {
      setVotingError(err.response?.data?.message || 'Failed to vote');
    }
  };

  const handleAnswerSubmitted = (newAnswer) => {
    setAnswers(prevAnswers => [...prevAnswers, newAnswer]);
  };

  const handleAnswerUpdate = (updatedAnswer) => {
    setAnswers(prevAnswers => 
      prevAnswers.map(answer => 
        answer._id === updatedAnswer._id ? updatedAnswer : answer
      )
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading question...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Question Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-btn">
            <ArrowLeft size={16} />
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Question Not Found</h2>
          <p>The question you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="back-btn">
            <ArrowLeft size={16} />
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="question-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => navigate('/')} className="breadcrumb-link">
          <ArrowLeft size={16} />
          All Questions
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Question</span>
      </div>

      {/* Main Question */}
      <div className="question-container">
        <div className="question-header">
          <h1 className="question-title">{question.title}</h1>
          
          <div className="question-meta">
            <div className="meta-item">
              <User size={16} />
              <span>Asked by {question.author?.name || 'Anonymous'}</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>{formatDate(question.createdAt)}</span>
            </div>
            <div className="meta-item">
              <Eye size={16} />
              <span>{question.views || 0} views</span>
            </div>
          </div>
        </div>

        <div className="question-content">
          <div className="question-voting">
            <button
              onClick={() => handleVote('upvote')}
              className={`vote-btn upvote ${
                user && question.upvotes?.includes(user._id) ? 'active' : ''
              }`}
              disabled={!user}
              title={user ? 'This question is useful' : 'Login to vote'}
            >
              <ChevronUp size={24} />
            </button>
            
            <span className="vote-count">
              {(question.upvotes?.length || 0) - (question.downvotes?.length || 0)}
            </span>
            
            <button
              onClick={() => handleVote('downvote')}
              className={`vote-btn downvote ${
                user && question.downvotes?.includes(user._id) ? 'active' : ''
              }`}
              disabled={!user}
              title={user ? 'This question is not useful' : 'Login to vote'}
            >
              <ChevronDown size={24} />
            </button>
          </div>

          <div className="question-body">
            <div 
              className="question-description"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
            
            <div className="question-tags">
              {question.tags?.map((tag) => (
                <span key={tag} className="tag">
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {votingError && (
          <div className="voting-error">
            {votingError}
          </div>
        )}
      </div>

      {/* Answers Section */}
      <div className="answers-container">
        <AnswerList
          answers={answers}
          questionAuthor={question.author?._id}
          onAnswerUpdate={handleAnswerUpdate}
        />
      </div>

      {/* Answer Form */}
      <div className="answer-form-container">
        <AnswerForm
          questionId={id}
          onAnswerSubmitted={handleAnswerSubmitted}
        />
      </div>
    </div>
  );
};

export default QuestionDetailPage;