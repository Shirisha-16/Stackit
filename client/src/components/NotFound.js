import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSearchQuestions = () => {
    navigate('/?search=');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        
        <div className="error-illustration">
          <div className="illustration-circle">
            <Search size={48} />
          </div>
        </div>
        
        <h1>Page Not Found</h1>
        
        <p className="error-message">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="not-found-actions">
          <button onClick={handleGoHome} className="primary-btn">
            <Home size={16} />
            Go to Home
          </button>
          
          <button onClick={handleGoBack} className="secondary-btn">
            <ArrowLeft size={16} />
            Go Back
          </button>
          
          <button onClick={handleSearchQuestions} className="tertiary-btn">
            <Search size={16} />
            Browse Questions
          </button>
        </div>
        
        <div className="helpful-links">
          <h3>You might be looking for:</h3>
          <ul>
            <li>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                Recent Questions
              </a>
            </li>
            <li>
              <a href="/ask" onClick={(e) => { e.preventDefault(); navigate('/ask'); }}>
                Ask a Question
              </a>
            </li>
            <li>
              <a href="/auth" onClick={(e) => { e.preventDefault(); navigate('/auth'); }}>
                Login / Register
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;