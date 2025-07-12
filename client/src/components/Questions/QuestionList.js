import React from 'react';
import QuestionCard from './QuestionCard';

const QuestionList = ({ questions }) => {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No questions found</div>
        <p className="text-gray-400">
          Be the first to ask a question and help build this community!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <QuestionCard key={question._id} question={question} />
      ))}
    </div>
  );
};

export default QuestionList;