import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { voteAnswer, acceptAnswer } from '../../api/answers';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

const AnswerList = ({ answers, questionAuthor, onAnswerUpdate }) => {
  const { user } = useContext(AuthContext);

  const handleVote = async (answerId, voteType) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }

    try {
      const updatedAnswer = await voteAnswer(answerId, voteType);
      onAnswerUpdate(updatedAnswer);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    if (!user || user._id !== questionAuthor) {
      alert('Only the question author can accept answers');
      return;
    }

    try {
      const updatedAnswer = await acceptAnswer(answerId);
      onAnswerUpdate(updatedAnswer);
    } catch (error) {
      console.error('Error accepting answer:', error);
      alert('Failed to accept answer. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!answers || answers.length === 0) {
    return (
      <div className="no-answers">
        <p>No answers yet. Be the first to answer!</p>
      </div>
    );
  }

  // Sort answers - accepted first, then by votes
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return (b.votes || 0) - (a.votes || 0);
  });

  return (
    <div className="answers-section">
      <h3>Answers ({answers.length})</h3>
      
      <div className="answers-list">
        {sortedAnswers.map((answer) => (
          <div 
            key={answer._id} 
            className={`answer-card ${answer.isAccepted ? 'accepted' : ''}`}
          >
            <div className="answer-voting">
              <button
                onClick={() => handleVote(answer._id, 'upvote')}
                className={`vote-btn upvote ${
                  user && answer.upvotes?.includes(user._id) ? 'active' : ''
                }`}
                disabled={!user}
              >
                <ChevronUp size={20} />
              </button>
              
              <span className="vote-count">
                {(answer.upvotes?.length || 0) - (answer.downvotes?.length || 0)}
              </span>
              
              <button
                onClick={() => handleVote(answer._id, 'downvote')}
                className={`vote-btn downvote ${
                  user && answer.downvotes?.includes(user._id) ? 'active' : ''
                }`}
                disabled={!user}
              >
                <ChevronDown size={20} />
              </button>

              {user && user._id === questionAuthor && !answer.isAccepted && (
                <button
                  onClick={() => handleAcceptAnswer(answer._id)}
                  className="accept-btn"
                  title="Accept this answer"
                >
                  <Check size={20} />
                </button>
              )}

              {answer.isAccepted && (
                <div className="accepted-indicator" title="Accepted answer">
                  <Check size={20} />
                </div>
              )}
            </div>

            <div className="answer-content">
              <div 
                className="answer-body"
                dangerouslySetInnerHTML={{ __html: answer.content }}
              />
              
              <div className="answer-meta">
                <span className="answer-author">
                  answered by {answer.author?.name || 'Anonymous'}
                </span>
                <span className="answer-date">
                  {formatDate(answer.createdAt)}
                </span>
                {answer.isAccepted && (
                  <span className="accepted-badge">✓ Accepted</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerList;