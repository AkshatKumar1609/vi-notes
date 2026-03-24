import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');

  return (
    <div className="editor-container">
      <textarea
        className="writing-editor"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing your content here..."
      />
    </div>
  );
}

export default App;