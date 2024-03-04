import React, { useState, useRef, useEffect } from 'react';
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
  const [sourceLanguage, setSourceLanguage] = useState('JavaScript');
  const [targetLanguage, setTargetLanguage] = useState('Python');

  useEffect(() => {
    setInputText('');
  }, [sourceLanguage]);
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
    if (!file) return;
  
    // Extensions based on the source language
    const extensions = {
      'JavaScript': ['.js'],
      'Python': ['.py'],
      'C++': ['.cpp', '.cxx', '.cc', '.h'],
      'Java': ['.java'],
      'Rust': ['.rs'],
    };
  
    // Ensure the sourceLanguage matches the keys in the extensions object
    const expectedExtensions = extensions[sourceLanguage];
    
    if (!expectedExtensions) {
      console.error('No expected extensions found for the selected source language.');
      return;
    }
  
    const fileExtension = `.${file.name.split('.').pop()}`;
  
    if (!expectedExtensions.includes(fileExtension)) {
      alert(`Please upload a file with the following extensions: ${expectedExtensions.join(', ')}`);
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (event) => {
      setInputText(event.target.result);
    };
    reader.readAsText(file);
  };
  

  // Example validation functions for each language
  const validateJavaScript = (text) => {
    // Very basic example: check if text includes a function keyword or semicolon
    return text.includes('function') || text.includes(';');
  };

  const validatePython = (text) => {
    // Basic example: check for Python-specific keywords
    return text.includes('def') || text.includes('import');
  };

  const validateCpp = (text) => {
    // Basic example: check for C++ specific indicators
    return text.includes('#include') || text.includes('int main');
  };

  const validateJava = (text) => {
    return text.includes('class') || text.includes('import java.');
  };
  
  const validateRust = (text) => {
    return text.includes('fn') || text.includes('use ');
  };

  const isValidInput = (text, language) => {
    switch (language) {
      case 'JavaScript':
        return validateJavaScript(text);
      case 'Python':
        return validatePython(text);
      case 'C++':
        return validateCpp(text);
      case 'Java':
        return validateJava(text);
      case 'Rust':
        return validateRust(text);
      default:
        return false; // Consider invalid if language is not recognized
    }
  };

  const handleTranslate = () => {
    // Validate input text before translating
    if (!isValidInput(inputText, sourceLanguage)) {
      alert(`Invalid ${sourceLanguage} code. Please check your input and try again.`);
      return; // Prevent translation from proceeding
    }

    // Proceed with translation if input is valid
    setOutputText(inputText); // Placeholder for actual translation logic
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      // You can display some message to the user indicating the text was copied
      console.log('Copied to clipboard');
    });
  };
  
  const handleDownloadCode = () => {
    // Mapping of target language to file extension
    const extensions = {
      'JavaScript': 'js',
      'Python': 'py',
      'C++': 'cpp',
      'Java': 'java',
      'Rust': 'rs',
    };
  
    // Determine the file extension based on the target language
    const extension = extensions[targetLanguage] || 'txt';
  
    // Create a blob with the output text
    const blob = new Blob([outputText], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
  
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = href;
    link.download = `translated_code.${extension}`; // Use the extension directly
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
                  <option value="Java">Java</option>
                  <option value="Rust">Rust</option>
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
                <option value="Java">Java</option>
                <option value="Rust">Rust</option>
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