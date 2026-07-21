import axios from "axios";
import { useState, useEffect } from "react";
import './ErrorPage.css'; // We'll create this



export function showErrorPage(typeOfError) {
  const [isVisible, setIsVisible] = useState(true);
  const [characterPosition, setCharacterPosition] = useState(-100);
  const [showMagnifyingGlass, setShowMagnifyingGlass] = useState(false);

  // Get error details based on type
  const getErrorDetails = (errorType) => {
    const errors = {
      USER_NOT_FOUND: {
        title: "🧐 Oops! User Went Missing!",
        message: "Our detective is on the case! This user seems to have vanished into the digital void.",
        emoji: "🔍",
        color: "#ff6b6b",
        suggestion: "Try checking the username or email address"
      },
      GROUP_NOT_FOUND: {
        title: "🏃‍♂️ Group Ran Away!",
        message: "Looks like this group is on an adventure! We can't seem to find them anywhere.",
        emoji: "👥",
        color: "#4ecdc4",
        suggestion: "The group might have been deleted or you might not have access"
      },
      // Add more error types
      NETWORK_ERROR: {
        title: "🌐 Connection Lost!",
        message: "Our signals are getting mixed up! The internet seems to be playing hide and seek.",
        emoji: "📡",
        color: "#ffd93d",
        suggestion: "Check your internet connection and try again"
      },
      AUTH_ERROR: {
        title: "🔒 Access Denied!",
        message: "You need a special VIP pass to enter this area! 🎫",
        emoji: "🛡️",
        color: "#a29bfe",
        suggestion: "Please log in or check your permissions"
      }
    };
    
    return errors[errorType] || errors.USER_NOT_FOUND;
  };

  const error = getErrorDetails(typeOfError);

  // Animate character coming in and out
  useEffect(() => {
    // Character enters from left
    setCharacterPosition(0);
    setShowMagnifyingGlass(true);
    
    // Character exits to right after 3 seconds
    const exitTimer = setTimeout(() => {
      setCharacterPosition(100);
      setShowMagnifyingGlass(false);
    }, 3000);
    
    // Component disappears after character exits
    const disappearTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(disappearTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="error-container">
      {/* Background decoration */}
      <div className="error-background">
        <div className="floating-emoji">🌟</div>
        <div className="floating-emoji">✨</div>
        <div className="floating-emoji">🎯</div>
        <div className="floating-emoji">🔍</div>
      </div>

      {/* Character with magnifying glass */}
      <div 
        className="character-container"
        style={{ 
          transform: `translateX(${characterPosition}%)`,
          opacity: characterPosition === 0 ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <div className="character">
          <div className="character-body">
            <div className="character-head">
              <div className="eyes">
                <div className="eye left-eye"></div>
                <div className="eye right-eye"></div>
              </div>
              <div className="mouth">😊</div>
            </div>
            <div className="character-body-shape"></div>
            <div className="arms">
              <div className="arm left-arm"></div>
              <div className="arm right-arm">
                {showMagnifyingGlass && (
                  <div className="magnifying-glass">
                    <div className="glass-handle"></div>
                    <div className="glass-circle">
                      <div className="glass-reflection"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="legs">
              <div className="leg left-leg"></div>
              <div className="leg right-leg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      <div className="error-content">
        <div className="error-icon">{error.emoji}</div>
        <h1 className="error-title">{error.title}</h1>
        <p className="error-message">{error.message}</p>
        <div className="error-suggestion">
          💡 <span>{error.suggestion}</span>
        </div>
        
        <div className="error-actions">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            🔄 Try Again
          </button>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            ⬅️ Go Back
          </button>
          <button className="btn btn-help" onClick={() => window.location.href = '/support'}>
            🆘 Get Help
          </button>
        </div>

        <div className="error-status">
          <span className="status-dot"></span>
          Error Code: {typeOfError}
        </div>
      </div>
    </div>
  );
}