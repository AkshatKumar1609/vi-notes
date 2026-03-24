import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { keystrokeTracker } from '../services/keystrokeTracker';
import sessionAPI from '../services/sessionAPI';
import '../styles/Editor.css';

const Editor: React.FC = () => {
  const [text, setText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState<{
    totalKeystrokes: number;
    totalPastes: number;
    pastePercentage: number;
    typingPattern: 'human' | 'mixed' | 'paste_heavy';
  }>({
    totalKeystrokes: 0,
    totalPastes: 0,
    pastePercentage: 0,
    typingPattern: 'human',
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Initialize session on mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await sessionAPI.createSession();
        if (response.data.success) {
          setSessionId(response.data.data._id);
          keystrokeTracker.startTracking();
          setIsSessionActive(true);
        }
      } catch (error) {
        console.error('Failed to create session:', error);
      }
    };

    initializeSession();

    // Cleanup on unmount
    return () => {
      keystrokeTracker.stopTracking();
    };
  }, []);

  /**
   * Handle paste event
   * Detects when user pastes text and records metadata
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text/plain');
    const position = textareaRef.current?.selectionStart || 0;

    // Record paste event (only metadata, not the content)
    keystrokeTracker.recordPaste(pastedText.length, position);

    // Update stats display
    updateStats();
  };

  /**
   * Handle content change
   */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    updateStats();
  };

  /**
   * Update typing statistics display
   */
  const updateStats = () => {
    const typingStats = keystrokeTracker.getTypingStats();
    setStats({
      totalKeystrokes: typingStats.totalKeystrokes,
      totalPastes: typingStats.totalPastes,
      pastePercentage: Math.round(typingStats.pastePercentage * 10) / 10,
      typingPattern: typingStats.typingPattern,
    });
  };

  /**
   * Save current session
   */
  const saveSession = async () => {
    if (!sessionId) return;

    setIsSaving(true);
    try {
      const sessionData = keystrokeTracker.getSessionData(sessionId, text);
      await sessionAPI.updateSession(sessionId, {
        content: text,
        keystrokeEvents: sessionData.keystrokeEvents,
        pasteEvents: sessionData.pasteEvents,
        contentLength: text.length,
      });
    } catch (error) {
      console.error('Failed to save session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Complete session and logout
   */
  const handleLogout = async () => {
    if (sessionId && isSessionActive) {
      setIsSaving(true);
      try {
        await sessionAPI.completeSession(sessionId, {
          content: text,
          contentLength: text.length,
        });
      } catch (error) {
        console.error('Failed to complete session:', error);
      } finally {
        setIsSaving(false);
      }
    }

    keystrokeTracker.stopTracking();
    logout();
    navigate('/login');
  };

  /**
   * Get color for typing pattern indicator
   */
  const getPatternColor = (): string => {
    switch (stats.typingPattern) {
      case 'human':
        return '#27ae60'; // Green
      case 'mixed':
        return '#f39c12'; // Orange
      case 'paste_heavy':
        return '#e74c3c'; // Red
      default:
        return '#95a5a6'; // Gray
    }
  };

  /**
   * Get label for typing pattern
   */
  const getPatternLabel = (): string => {
    switch (stats.typingPattern) {
      case 'human':
        return 'Human Typing';
      case 'mixed':
        return 'Mixed (Typing + Paste)';
      case 'paste_heavy':
        return 'Paste Heavy';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-header">
        <div className="header-left">
          <h1>Vi-Notes Editor</h1>
          {isSessionActive && (
            <div className="session-status">
              <span className="status-indicator"></span>
              <span>Session Active</span>
            </div>
          )}
        </div>
        <div className="header-right">
          <div className="typing-pattern-indicator" style={{ borderColor: getPatternColor() }}>
            <span className="pattern-label">{getPatternLabel()}</span>
            <span className="pattern-percentage">{stats.pastePercentage}% Pasted</span>
          </div>
          <div className="user-info">
            <span>{user?.email}</span>
            <button
              onClick={handleLogout}
              className="logout-btn"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      <div className="editor-container">
        <textarea
          ref={textareaRef}
          className="writing-editor"
          value={text}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder="Start typing or paste your content here. All typing behavior is monitored to verify authenticity."
        />
      </div>

      <div className="editor-footer">
        <div className="stats-panel">
          <div className="stat-item">
            <span className="stat-label">Characters:</span>
            <span className="stat-value">{text.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Keystrokes:</span>
            <span className="stat-value">{stats.totalKeystrokes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Paste Events:</span>
            <span className="stat-value">{stats.totalPastes}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Session:</span>
            <span className="stat-value">
              {isSessionActive ? 'Recording' : 'Idle'}
            </span>
          </div>
        </div>
        <button
          className="save-btn"
          onClick={saveSession}
          disabled={isSaving || !isSessionActive}
          title="Save session progress"
        >
          {isSaving ? 'Saving...' : 'Save Progress'}
        </button>
      </div>
    </div>
  );
};

export default Editor;
