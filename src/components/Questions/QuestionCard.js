import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageCircle, Eye, Calendar, User } from 'lucide-react';

const QuestionCard = ({ question }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        {/* Vote Count */}
        <div className="flex flex-col items-center space-y-1 min-w-0">
          <div className="flex items-center space-x-1 text-gray-600">
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm font-medium">{question.voteCount || 0}</span>
          </div>
          <div className="text-xs text-gray-500">votes</div>
        </div>
        {/* Answer Count */}
        <div className="flex flex-col items-center space-y-1 min-w-0">
          <div className="flex items-center space-x-1 text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{question.answerCount || 0}</span>
          </div>
          <div className="text-xs text-gray-500">answers</div>
        </div>
        {/* View Count */}
        <div className="flex flex-col items-center space-y-1 min-w-0">
          <div className="flex items-center space-x-1 text-gray-600">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{question.views || 0}</span>
          </div>
          <div className="text-xs text-gray-500">views</div>
        </div>
        {/* Question Content */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/question/${question._id}`} // This uses a backtick template literal
            className="block hover:text-blue-600 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {question.title}
            </h3>
          </Link>

          <div
            className="text-gray-600 text-sm mb-3 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: truncateText(question.description.replace(/<[^>]*>/g, ''))
            }}
          />
          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* Author and Date */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{question.author?.username || 'Anonymous'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(question.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;