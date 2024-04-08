import React, { useState, useRef, useEffect } from 'react';
import './TranslatePage.css';
import { FaRegClipboard, FaDownload, FaUpload, FaHistory, FaJsSquare, FaPython, FaCuttlefish, FaJava, FaRust, FaArrowRight } from 'react-icons/fa';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/clike/clike.js'; // for C++
import axios from 'axios'
import { SITE_URL, FLASK_URL } from '../../vars'
import { isExpired } from '../../vars';
import AlertBox from '../AlertBox/AlertBox';

const TranslatePage = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('JavaScript');
  const [targetLanguage, setTargetLanguage] = useState('Python');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [sortMethod, setSortMethod] = useState('date');
  const [dateFilter, setDateFilter] = useState('');
  const [sourceLanguageFilter, setSourceLanguageFilter] = useState('');
  const [targetLanguageFilter, setTargetLanguageFilter] = useState('');
  let goodapi;

  const filterTranslationHistory = (history) => {
    return history
      .filter((item) => {
        // Filter by date if a date filter is set
        return dateFilter ? item.formattedDate === dateFilter : true;
      })
      .filter((item) => {
        // Filter by source language if a source language filter is set
        return sourceLanguageFilter ? item.source_language === sourceLanguageFilter : true;
      })
      .filter((item) => {
        // Filter by target language if a target language filter is set
        return targetLanguageFilter ? item.target_language === targetLanguageFilter : true;
      });
  };
  
  
  // Function to get the appropriate icon based on the language
  const languageIcons = {
    'JavaScript': FaJsSquare,
    'Python': FaPython,
    'C++': FaCuttlefish, // Replace with the appropriate icon for C++
    'Java': FaJava,
    'Rust': FaRust,
  };

  // Function to create icon elements with proper classes
  const getLanguageIconElement = (language) => {
    const iconClass = language.replace('+', 'p').toLowerCase(); // Replace '+' with 'p' and make it lowercase
    const IconComponent = languageIcons[language];
    return IconComponent ? <IconComponent className={`language-icon ${iconClass}`} /> : null;
  };
  
  const handleClick = () => {
    setIsTranslating(true);
    handleTranslate(); 
  };

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
      goodapi = true
    }
    else {
      goodapi = false
      return 'red';
    }
  }

  
  
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

  const populateCodeMirror = (original_code, translated_code, source_lang, target_lang) => {
    setInputText(original_code);
    setOutputText(translated_code);
    setSourceLanguage(source_lang); // Update the source language dropdown
    setTargetLanguage(target_lang); // Update the target language dropdown
  };

  const filteredTranslationHistory = filterTranslationHistory(translationHistory);

  const groupByDate = filteredTranslationHistory.reduce((group, item) => {
    const { formattedDate } = item;
    group[formattedDate] = group[formattedDate] ?? [];
    group[formattedDate].push(item);
    return group;
  }, {});

  useEffect(() => {
    // Assume user_id is fetched from somewhere in your application
    const user_id = localStorage.getItem("user_id");
    axios.get(`${FLASK_URL}/api/translation-history/${user_id}`)
      .then(response => {
        // Process the data to format dates as 'Today', 'Yesterday', etc.
        const processedHistory = response.data.map(item => {
          // Create a new Date object from item.submission_date
          const submissionDate = new Date(item.submission_date);
          // Format the date
          const formattedDate = formatSubmissionDate(submissionDate);
          // Return a new object with the formatted date
          return { ...item, formattedDate };
        });
        // Set the processed history to state
        setTranslationHistory(processedHistory);
      })
      .catch(error => console.error("Error fetching translation history:", error));
  }, [setTranslationHistory, sortMethod, dateFilter, sourceLanguageFilter, targetLanguageFilter]); // Add any other dependencies if needed
  
  // Helper function to format the date
  function formatSubmissionDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return 'Previous 30 Days';
    }
  }

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
      alert('inputText is undefined, not a string, or empty');
      console.error('inputText is undefined, not a string, or empty');
      setIsTranslating(false)
      return;
    }

    // Validate input text before translating
    if (!isValidInput(inputText, sourceLanguage)) {
      alert(`Invalid ${sourceLanguage} code. Please check your input and try again.`);
      setIsTranslating(false)
      return; // Prevent translation from proceeding
    }

    // Proceed with translation if input is valid
    setNotificationMessage("Translation in progress...");
    setShowLoading(true);
    getTranslation();
  };

  var res
  const getTranslation = () => {
    setIsLoading(true);
    const message = {
      text: inputText,
      srcLang: sourceLanguage,
      toLang: targetLanguage,
      user_id: parseInt(localStorage.getItem("user_id"))
    }
    setIsLoading(true);
    axios.post(`${FLASK_URL}/translate`, message)
      .then((response) => {
        res = response.data
        // TODO: Handle other data being sent from backend
        if (res.success) {
          setOutputText(res.output)
          console.log(`Finish reason: ${res.finish_reason}`)
          if (res.finish_reason != "stop") {
            var message = "Translate halted because"
            if (res.finish_reason == "length") alert(`${message} translated code is too long - too many tokens.`)
            if (res.finish_reason == "content_filter") alert(`${message} code content was flagged by openai content filters.`)
          }
        }

        console.log(`Response has error: ${res.hasError}`)
        if (res.errorMessage) console.log(`Other errors: ${res.errorMessage}`)
        if (res.apiErrorMessage) {
          alert(`API Error: ${res.apiErrorMessage}\nCode: ${res.errorCode}`)
        }
      }).catch((error) => {
        if (error.response) {
          alert(`Error enocuntered: ${res.errorMessage}`)
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
        }
        // Hide loading box after translation
      }).finally(() => {
        setIsTranslating(false) // Call the callback function to reset the button state
      });
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
  if (!localStorage.getItem("isLoggedIn")) window.location.assign(`${SITE_URL}/login?redirect=true`)
  else {
    return (
      <div className="translate-page">
        <div className="sidebar-container">
        <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
          <FaHistory className="history-icon" />
        </button>
        {showSidebar && (
        <div className={`sidebar ${showSidebar ? 'show-sidebar' : ''}`}>
          <div className="sorting-controls">
            <div className="sort-by-date">
              <label htmlFor="dateFilter">Date:</label>
              <select id="dateFilter" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="form-control">
                <option value="">All Dates</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Previous 30 Days">Previous 30 Days</option>
              </select>
            </div>
            <div className="sort-by-source-language">
              <label htmlFor="sourceLanguageFilter">Source Language:</label>
              <select id="sourceLanguageFilter" value={sourceLanguageFilter} onChange={(e) => setSourceLanguageFilter(e.target.value)} className="form-control">
                <option value="">All Languages</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Rust">Rust</option>
              </select>
            </div>
            <div className="sort-by-target-language">
              <label htmlFor="targetLanguageFilter">Target Language:</label>
              <select id="targetLanguageFilter" value={targetLanguageFilter} onChange={(e) => setTargetLanguageFilter(e.target.value)} className="form-control">
                <option value="">All Languages</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Rust">Rust</option>
              </select>
            </div>
          </div>

        <p className="translation-history-title">Translation History</p>
        {Object.entries(groupByDate).map(([date, items], dateIndex) => (
          <div key={dateIndex}>
            <div className={`${date.toLowerCase().replace(/\s/g, '-')}-section section-title`}>{date}</div>
            {items.map((item, itemIndex) => (
              <div key={itemIndex} className="history-item" onClick={() => populateCodeMirror(item.original_code, item.translated_code, item.source_language, item.target_language)}>
                {getLanguageIconElement(item.source_language)}
                <span className="source-language">{item.source_language}</span>
                <FaArrowRight className="arrow-icon" />
                {getLanguageIconElement(item.target_language)}
                <span className="target-language">{item.target_language}</span>
              </div>
            ))}
          </div>
        ))}
      </div>      
      )}
      </div>
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
              className={`btn-translate-button${isTranslating ? '-translating' : '-regular'}`}
              onClick={handleClick}
              disabled={isTranslating}
            >
              {isTranslating ? 'Translating...' : 'Get Translation'}
            </button>
          </div>
        </div>
        <a href='/report' htmlFor="sourceLanguage" >Having trouble? Report errors here</a>
      </div>
    );
  }
}

export default TranslatePage;