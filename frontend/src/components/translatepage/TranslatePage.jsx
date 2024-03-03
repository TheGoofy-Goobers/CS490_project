import React, { useState, useRef } from 'react';
import './TranslatePage.css';
import { FaRegClipboard, FaDownload, FaUpload } from 'react-icons/fa';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js'; // for C++

const TranslatePage = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('javascript');
  const [targetLanguage, setTargetLanguage] = useState('python');

  const fileInputRef = useRef(null);

  const getMode = (language) => {
    switch (language) {
      case 'JavaScript':
        return 'javascript';
      case 'Python':
        return 'python';
      case 'C++':
        return 'text/x-c++src'; // Mode for C++
      default:
        return 'javascript';
    }
  };

  // Function to trigger the hidden file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Function to handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle the file upload here
      console.log('File uploaded:', file.name);
      // You can read the file and set it to inputText or perform other actions
    }
  };

  const handleTranslate = () => {
    setOutputText(inputText);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      // You can display some message to the user indicating the text was copied
      console.log('Copied to clipboard');
    });
  };
  
  const handleDownloadCode = () => {
    // Determine the MIME type based on the target language
    let type = 'text/plain'; // Default MIME type
    switch (targetLanguage) {
      case 'JavaScript':
        type = 'text/javascript';
        break;
      case 'Python':
        type = 'text/x-python';
        break;
      case 'C++':
        type = 'text/x-c++src';
        break;
      default:
        break;
    }
  
    const blob = new Blob([outputText], { type });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
  
    // Use the selected target language to determine the file extension
    const extension = targetLanguage === 'JavaScript' ? 'js' :
                      targetLanguage === 'Python' ? 'py' :
                      targetLanguage === 'C++' ? 'cpp' :
                      'txt'; // Fallback for unrecognized languages
  
    link.download = `translated_code.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="translate-page">
       
        <div className="container main-content">
        <div className="code-container">
          <div className="code-box input-box">
            <h2>Input</h2>
            <div className="input-header">
              <div className="form-group">
                <label htmlFor="sourceLanguage">Source Language</label>
                <select
                  className="form-control"
                  id="sourceLanguage"
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                </select>
              </div>
              <FaUpload className="icon upload-icon" onClick={handleUploadClick} title="Upload File" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
            <CodeMirror
              value={inputText}
              options={{
                mode: getMode(sourceLanguage),
                theme: 'material',
                lineNumbers: true,
              }}
              onChange={(editor, data, value) => setInputText(value)}
            />
          </div>
          <div className="code-box output-box">
            <h2>Output</h2>
            <div className="form-group">
              <label htmlFor="targetLanguage">Target Language</label>
              <select
                className="form-control"
                id="targetLanguage"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="C++">C++</option>
              </select>
            </div>
            <div className="position-relative textarea-container">
              <CodeMirror
                value={outputText}
                options={{
                  mode: getMode(targetLanguage),
                  theme: 'material',
                  lineNumbers: true,
                  readOnly: true,
                }}
              />
              <div className="icons">
                <FaRegClipboard className="icon" onClick={handleCopyToClipboard} title="Copy to Clipboard" />
                <FaDownload className="icon" onClick={handleDownloadCode} title="Download Code" />
              </div>
            </div>
          </div>
        </div>
        <div className="translate-button-container">
          <button
            id="translateBtn"
            className="btn translate-button"
            onClick={handleTranslate}
          >
            Translate
          </button>
        </div>
      </div>
    </div>
  );
}

export default TranslatePage;