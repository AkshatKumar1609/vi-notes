import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import sessionAPI from '../services/sessionAPI';
import '../styles/SessionHistory.css';

interface WritingSession {
  _id: string;
  content: string;
  sessionStartTime: string;
  sessionEndTime?: string;
  totalDuration?: number;
  totalKeystrokes: number;
  totalPastes: number;
  contentLength: number;
}

const SessionHistory: React.FC = () => {
  const [sessions, setSessions] = useState<WritingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch user sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  /**
   * Fetch all sessions for current user
   */
  const fetchSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await sessionAPI.getUserSessions();
      if (response.data.success) {
        setSessions(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load sessions');
      console.error('Failed to fetch sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Format date to readable format
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Format duration from milliseconds to readable format
   */
  const formatDuration = (ms?: number): string => {
    if (!ms) return 'In Progress';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  /**
   * Get typing pattern classification
   */
  const getTypingPattern = (session: WritingSession): string => {
    if (session.totalKeystrokes === 0) return 'No Data';
    const pastedChars =
      session.totalPastes > 0
        ? session.totalPastes * 50 // Estimate average paste size
        : 0;
    const totalChars = session.contentLength;
    const pastePercentage =
      totalChars > 0 ? (pastedChars / totalChars) * 100 : 0;

    if (pastePercentage < 5) return 'Human Typing';
    if (pastePercentage < 30) return 'Mixed';
    return 'Paste Heavy';
  };

  /**
   * Get pattern color
   */
  const getPatternColor = (pattern: string): string => {
    switch (pattern) {
      case 'Human Typing':
        return '#27ae60'; // Green
      case 'Mixed':
        return '#f39c12'; // Orange
      case 'Paste Heavy':
        return '#e74c3c'; // Red
      default:
        return '#95a5a6'; // Gray
    }
  };

  /**
   * Navigate to session detail page
   */
  const viewSession = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  /**
   * Navigate back to editor
   */
  const goToEditor = () => {
    navigate('/editor');
  };

  return (
    <div className="session-history-page">
      <div className="history-header">
        <div className="header-content">
          <h1>Writing Sessions</h1>
          <p className="user-email">{user?.email}</p>
        </div>
        <button onClick={goToEditor} className="new-session-btn">
          + New Session
        </button>
      </div>

      <div className="history-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your sessions...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={fetchSessions} className="retry-btn">
              Retry
            </button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No sessions yet</h2>
            <p>Start writing a new session to begin tracking your work</p>
            <button onClick={goToEditor} className="start-btn">
              Start Writing
            </button>
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map((session) => {
              const pattern = getTypingPattern(session);
              const patternColor = getPatternColor(pattern);

              return (
                <div
                  key={session._id}
                  className="session-card"
                  onClick={() => viewSession(session._id)}
                >
                  <div className="session-header">
                    <div className="session-date">
                      <span className="date-label">Started</span>
                      <span className="date-value">
                        {formatDate(session.sessionStartTime)}
                      </span>
                    </div>
                    <div
                      className="pattern-badge"
                      style={{ backgroundColor: patternColor }}
                    >
                      {pattern}
                    </div>
                  </div>

                  <div className="session-preview">
                    <p className="content-preview">
                      {session.content.substring(0, 150)}
                      {session.content.length > 150 ? '...' : ''}
                    </p>
                  </div>

                  <div className="session-stats">
                    <div className="stat-item">
                      <span className="stat-label">Characters</span>
                      <span className="stat-value">{session.contentLength}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Keystrokes</span>
                      <span className="stat-value">{session.totalKeystrokes}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Pastes</span>
                      <span className="stat-value">{session.totalPastes}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Duration</span>
                      <span className="stat-value">
                        {formatDuration(session.totalDuration)}
                      </span>
                    </div>
                  </div>

                  {session.sessionEndTime && (
                    <div className="session-footer">
                      <span className="completed-badge">✓ Completed</span>
                      <span className="end-time">
                        {formatDate(session.sessionEndTime)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionHistory;
