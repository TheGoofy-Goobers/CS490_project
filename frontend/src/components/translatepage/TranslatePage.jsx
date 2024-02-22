import React, { useState } from 'react';
import './TranslatePage.css';

const TranslatePage = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = async () => {
    // Placeholder for the API call
    setTranslatedText(sourceText);
  };

  return (
    <div className="translate-container">
      <div className="translate-panel">
        <div className="translate-column input-column">
          <h2>Input</h2>
          <select className="language-select" id="sourceLanguage">
            <option>JavaScript</option>
            {/* Add more source language options here */}
          </select>
          <textarea
            className="code-area"
            placeholder="Enter some code..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
          />
        </div>
        <button id="translateBtn" className="translate-button" onClick={handleTranslate}>
          Translate
        </button>
        <div className="translate-column output-column">
          <h2>Output</h2>
          <select className="language-select" id="targetLanguage">
            <option>Python</option>
            {/* Add more target language options here */}
          </select>
          <textarea
            className="code-area"
            placeholder="Translated code will appear here..."
            value={translatedText}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default TranslatePage;
