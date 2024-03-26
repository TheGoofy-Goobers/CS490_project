import React, { useState, useRef, useEffect } from 'react';
import './TranslatePage.css';
import { FaRegClipboard, FaDownload, FaUpload } from 'react-icons/fa';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js'; // for C++
import axios from 'axios'
import { SITE_URL, FLASK_URL } from '../../vars'

const TranslatePage = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('JavaScript');
  const [targetLanguage, setTargetLanguage] = useState('Python');
  const [isLoading, setIsLoading] = useState(false);


  // TODO: Display the status on the page
  axios.get(`${FLASK_URL}/getApiStatus`)
  .then((response) => {
    const res = response.data
    console.log(`Status: ${res.code} ${res.reason}`)
    // by javascript selects background
    document.querySelector('.status').style.background = setBackgroundStats(res);
  }).catch((error) => {
    if (error.response) {
      console.log(error.response)
      console.log(error.response.status)
      console.log(error.response.headers)
      }
  })

// checks response to determine background clor
  function setBackgroundStats(res) {
    if (res.code === 200) {
      return 'green';
    }
    else
      return 'red';
  }
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
    // Check for common JavaScript patterns and syntax
    return /function|var|let|const|=>|console\.log\(/.test(text);
  };
  
  const validatePython = (text) => {
    // Enhanced Python validation to exclude non-Python code and include Python-specific syntax
    // Check for clear signs of Python code
    const pythonSigns = /def |import |print\(|if |elif |else:|for |in |range\(|class |self/.test(text);
    // Check for patterns common in JavaScript/JSX, indicating it's likely not Python
    const nonPythonSigns = /import .* from '.*'|class .* extends|return \(<\/?[\w\s="/.]+>\);|export default /.test(text);
    
    // Consider valid if it looks like Python and doesn't contain patterns common in JavaScript/JSX
    return pythonSigns && !nonPythonSigns;
  };
  
  const validateCpp = (text) => {
    // Check for C++ specific indicators, including common library includes and main function
    return /#include <iostream>|using namespace std;|int main\(\)|cout <<|cin >>/.test(text);
  };
  
  const validateJava = (text) => {
    // Enhanced to include class definition, main method, and common print statement
    return /class |import java.|public static void main|System\.out\.println\(/.test(text);
  };
  
  const validateRust = (text) => {
    // Check for Rust-specific syntax, including function declaration and common imports
    return /fn |use |let |println!\(|struct |enum |impl |mod |pub /.test(text);
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
    if (typeof inputText !== 'string' || inputText.trim() === '') {
      console.error('inputText is undefined, not a string, or empty');
      return;
    }
  
    // Validate input text before translating
    if (!isValidInput(inputText, sourceLanguage)) {
      alert(`Invalid ${sourceLanguage} code. Please check your input and try again.`);
      return; // Prevent translation from proceeding
    }

    // Proceed with translation if input is valid
    getTranslation();
  };

  var res
  const getTranslation = () => {
    const message = {
      text: inputText, 
      srcLang: sourceLanguage, 
      toLang: targetLanguage, 
      user_id: parseInt(sessionStorage.getItem("user_id"))
    }

    axios.post(`${FLASK_URL}/translate`, message)
    .then((response) => {
      res = response.data
      // TODO: Handle other data being sent from backend
      if (res.success) {
        setOutputText(res.output)
        console.log(`Finish reason: ${res.finish_reason}`)
        // TODO: handle potential errors from finish_reason (content_filter, length)
        // Errors should be displayed 
      }
      
      console.log(`Response has error: ${res.hasError}`)
      if(res.errorMessage) console.log(`Other errors: ${res.errorMessage}`)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  };

  const handleCopyToClipboard = (onSuccess) => {
    navigator.clipboard.writeText(outputText).then(() => {
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
  if (!sessionStorage.getItem("isLoggedIn")) window.location.assign(`${SITE_URL}/login?redirect=true`)
  else{
    return (
      <div className="translate-page">
        
          <div className="container main-content">
	  <div className="status">
            <a className='status_display' >Chat-GPT Status</a>
          </div>
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
                  data-testid="fileInput"
                  
                />
              </div>
              <CodeMirror
                value={inputText}
                options={{
                  mode: getMode(sourceLanguage),
                  theme: 'material',
                  lineNumbers: true,
                }}
                onChange={(editor, data, value) => {
                  setInputText(value); // This is the right approach for handling changes
                }}
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
            disabled={isLoading}
          >
            Translate
          </button>
          {isLoading && <p>Loading...</p>}
          </div>
        </div>
      </div>
    );
  }
}

export default TranslatePage;