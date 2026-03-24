import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Editor.css';

const Editor: React.FC = () => {
  const [text, setText] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h1>Vi-Notes Editor</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
      <div className="editor-container">
        <textarea
          className="writing-editor"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start writing your content here..."
        />
      </div>
    </div>
  );
};

export default Editor;
