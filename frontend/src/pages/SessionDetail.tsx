import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import sessionAPI from '../services/sessionAPI';
import '../styles/SessionDetail.css';

interface IKeystrokeEvent {
  timestamp: number;
  keyCode: number;
  duration: number;
}

interface IPasteEvent {
  timestamp: number;
  textLength: number;
  position: number;
}

interface WritingSession {
  _id: string;
  content: string;
  keystrokeEvents: IKeystrokeEvent[];
  pasteEvents: IPasteEvent[];
  sessionStartTime: string;
  sessionEndTime?: string;
  totalDuration?: number;
  totalKeystrokes: number;
  totalPastes: number;
  contentLength: number;
}

const SessionDetail: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<WritingSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'stats' | 'events'>('content');
  const navigate = useNavigate();

  // Fetch session on mount
  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!sessionId) {
        setError('Invalid session ID');
        return;
      }
      const response = await sessionAPI.getSession(sessionId);
      if (response.data.success) {
        setSession(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load session');
      console.error('Failed to fetch session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

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
      second: '2-digit',
    });
  };

  /**
   * Format duration from milliseconds
   */
  const formatDuration = (ms?: number): string => {
    if (!ms) return 'In Progress';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  /**
   * Calculate typing statistics
   */
  const calculateStats = () => {
    if (!session) return null;

    const totalChars = session.contentLength;
    const avgKeystrokeDuration =
      session.keystrokeEvents.length > 0
        ? session.keystrokeEvents.reduce((sum, e) => sum + e.duration, 0) /
          session.keystrokeEvents.length
        : 0;

    const totalPastedChars = session.pasteEvents.reduce(
      (sum, e) => sum + e.textLength,
      0
    );
    const pastePercentage =
      totalChars > 0 ? (totalPastedChars / totalChars) * 100 : 0;

    let typingPattern: 'human' | 'mixed' | 'paste_heavy' = 'human';
    if (pastePercentage >= 30) typingPattern = 'paste_heavy';
    else if (pastePercentage >= 5) typingPattern = 'mixed';

    return {
      totalChars,
      avgKeystrokeDuration,
      totalPastedChars,
      pastePercentage,
      typingPattern,
    };
  };

  /**
   * Get pattern label and color
   */
  const getPatternInfo = (
    pattern: 'human' | 'mixed' | 'paste_heavy'
  ): { label: string; color: string } => {
    const patternMap = {
      human: { label: 'Human Typing', color: '#27ae60' },
      mixed: { label: 'Mixed (Typing + Paste)', color: '#f39c12' },
      paste_heavy: { label: 'Paste Heavy', color: '#e74c3c' },
    };
    return patternMap[pattern];
  };

  /**
   * Export session as JSON
   */
  const exportSession = () => {
    if (!session) return;
    const dataStr = JSON.stringify(session, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `session-${session._id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = calculateStats();

  return (
    <div className="session-detail-page">
      <div className="detail-header">
        <div className="header-left">
          <button onClick={() => navigate('/sessions')} className="back-btn">
            ← Back to Sessions
          </button>
          <h1>Session Details</h1>
        </div>
        <button onClick={exportSession} className="export-btn">
          ⬇ Export JSON
        </button>
      </div>

      {isLoading ? (
        <div className="detail-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading session details...</p>
          </div>
        </div>
      ) : error ? (
        <div className="detail-container">
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={fetchSession} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      ) : session && stats ? (
        <div className="detail-container">
          {/* Session Summary */}
          <div className="session-summary">
            <div className="summary-left">
              <div className="summary-item">
                <span className="label">Started</span>
                <span className="value">
                  {formatDate(session.sessionStartTime)}
                </span>
              </div>
              {session.sessionEndTime && (
                <div className="summary-item">
                  <span className="label">Ended</span>
                  <span className="value">
                    {formatDate(session.sessionEndTime)}
                  </span>
                </div>
              )}
              <div className="summary-item">
                <span className="label">Duration</span>
                <span className="value">
                  {formatDuration(session.totalDuration)}
                </span>
              </div>
            </div>

            <div className="summary-right">
              <div
                className="pattern-display"
                style={{
                  borderColor: getPatternInfo(stats.typingPattern).color,
                }}
              >
                <span className="pattern-label">
                  {getPatternInfo(stats.typingPattern).label}
                </span>
                <span className="pattern-percentage">
                  {Math.round(stats.pastePercentage * 10) / 10}% Pasted
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content ({stats.totalChars} chars)
            </button>
            <button
              className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              Statistics
            </button>
            <button
              className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Events ({session.keystrokeEvents.length +
                session.pasteEvents.length})
            </button>
          </div>

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="tab-content">
              <div className="content-box">
                <pre className="session-text">{session.content}</pre>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="tab-content">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-title">Total Characters</div>
                  <div className="stat-number">{stats.totalChars}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Total Keystrokes</div>
                  <div className="stat-number">{session.totalKeystrokes}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Average Keystroke Duration</div>
                  <div className="stat-number">
                    {Math.round(stats.avgKeystrokeDuration)}ms
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Total Paste Events</div>
                  <div className="stat-number">{session.totalPastes}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Characters Pasted</div>
                  <div className="stat-number">{stats.totalPastedChars}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Paste Ratio</div>
                  <div className="stat-number">
                    {Math.round(stats.pastePercentage * 10) / 10}%
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Session Duration</div>
                  <div className="stat-number">
                    {formatDuration(session.totalDuration)}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Typing Pattern</div>
                  <div className="stat-number">
                    {getPatternInfo(stats.typingPattern).label}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="tab-content">
              <div className="events-container">
                {/* Keystroke Events */}
                {session.keystrokeEvents.length > 0 && (
                  <div className="events-section">
                    <h3>Keystroke Events ({session.keystrokeEvents.length})</h3>
                    <div className="events-list">
                      {session.keystrokeEvents.slice(0, 50).map((event, idx) => (
                        <div key={idx} className="event-item keystroke-event">
                          <span className="event-time">
                            {Math.round(event.timestamp)}ms
                          </span>
                          <span className="event-detail">
                            Key Code: {event.keyCode}
                          </span>
                          <span className="event-duration">
                            {event.duration}ms
                          </span>
                        </div>
                      ))}
                      {session.keystrokeEvents.length > 50 && (
                        <p className="events-notice">
                          ... and {session.keystrokeEvents.length - 50} more
                          keystroke events
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Paste Events */}
                {session.pasteEvents.length > 0 && (
                  <div className="events-section">
                    <h3>Paste Events ({session.pasteEvents.length})</h3>
                    <div className="events-list">
                      {session.pasteEvents.map((event, idx) => (
                        <div key={idx} className="event-item paste-event">
                          <span className="event-time">
                            {Math.round(event.timestamp)}ms
                          </span>
                          <span className="event-detail">
                            Characters: {event.textLength}
                          </span>
                          <span className="event-position">
                            Position: {event.position}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {session.keystrokeEvents.length === 0 &&
                  session.pasteEvents.length === 0 && (
                    <p className="no-events">No recording events captured</p>
                  )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="detail-container">
          <div className="error-state">
            <p>No session data available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetail;
