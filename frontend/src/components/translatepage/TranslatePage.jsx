import React, { useState, useRef } from 'react';
import {FLASK_URL} from '../../vars.js'
import axios from 'axios'
import './TranslatePage.css';
import { FaRegClipboard, FaDownload, FaUpload } from 'react-icons/fa';
import aboutUsIcon from './about_us.png'; // Assuming the images are in the same directory
import feedbackIcon from './feedback.png';
import githubIcon from './github-logo.png';
import profileIcon from './Profile.png';
import translatorIcon from './translator_icon.png';

const TranslatePage = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('Python');

  const fileInputRef = useRef(null);

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
    const blob = new Blob([outputText], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    // Use the selected target language to determine the file extension
    const extension = targetLanguage === 'JavaScript' ? 'js' :
                      targetLanguage === 'Python' ? 'py' :
                      targetLanguage === 'C++' ? 'cpp' :
                      'txt'; // Default or any other condition for C++
    link.download = `code.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  //sample function linked to flask backend
  const [profileData, setProfileData] = useState(null)
  const getData = () => {
    axios({
      method: "GET",
      url:`${FLASK_URL}/profile`,
    })
    .then((response) => {
      const res =response.data
      setProfileData(({
        profile_name: res.name,
        about_me: res.about}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  //TODO handle login response and redirection on front end
  var res
  const login = () => {
    axios.post(`${FLASK_URL}/userLoginCredentials`, {
      // TODO: Data should be passed in from form- this function will likely be moved to a different component
      username: "sampleUser",
      password: "somepassword"
    }).then((response) => {
      res = response.data
      console.log(`Response has error: ${res.errors}`)
      if(res.errors) console.log(`Error response: ${res.errorMessage}`)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  return (
    <div className="translate-page">
        <header className="banner">
          <div className="container">
            <div className="logo-container">
              {/* SVG butterfly */}
              <svg className="logo-butterfly" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1296 1727.999927" preserveAspectRatio="xMidYMid meet">
                  <path fill="#ff7300" d="M 737.007812 651.265625 L 1016.507812 437.597656 L 1296 339.113281 L 1231.910156 454.289062 L 737.007812 651.265625 " fill-opacity="1" fill-rule="nonzero"/><path fill="#d35a00" d="M 1231.910156 454.289062 L 952.417969 723.039062 L 690.726562 704.679688 L 737.007812 651.265625 L 1231.910156 454.289062 " fill-opacity="1" fill-rule="nonzero"/><path fill="#7f3600" d="M 690.726562 704.679688 L 631.980469 1043.542969 L 893.671875 761.433594 L 890.097656 716.367188 L 690.726562 704.679688 " fill-opacity="1" fill-rule="nonzero"/><path fill="#d35a00" d="M 452.171875 1128.675781 L 635.535156 774.792969 L 459.289062 998.46875 L 373.84375 1178.75 L 452.171875 1128.675781 " fill-opacity="1" fill-rule="nonzero"/><path fill="#7f3600" d="M 788.636719 609.53125 L 742.34375 629.5625 L 737.007812 651.265625 L 708.515625 652.933594 L 617.726562 781.472656 L 441.480469 976.765625 L 459.289062 998.46875 L 690.726562 704.679688 L 733.453125 657.945312 L 788.636719 609.53125 " fill-opacity="1" fill-rule="nonzero"/><path fill="#ff7300" d="M 724.535156 651.265625 L 708.515625 652.933594 L 418.34375 48.664062 L 558.980469 0.25 L 672.929688 102.074219 L 724.535156 651.265625 " fill-opacity="1" fill-rule="nonzero"/><path fill="#d35a00" d="M 724.535156 651.265625 L 774.402344 532.746094 L 754.820312 262.328125 L 672.929688 102.074219 L 724.535156 651.265625 " fill-opacity="1" fill-rule="nonzero"/><path fill="#d35a00" d="M 418.34375 48.664062 L 243.890625 315.742188 L 343.59375 424.25 L 688.945312 681.304688 L 708.515625 652.933594 L 418.34375 48.664062 " fill-opacity="1" fill-rule="nonzero"/><path fill="#7f3600" d="M 688.945312 681.304688 L 340.019531 419.238281 C 340.019531 419.238281 154.882812 452.621094 154.882812 447.621094 C 154.882812 442.609375 0 681.304688 0 681.304688 L 688.945312 681.304688 " fill-opacity="1" fill-rule="nonzero"/><path fill="#ad4e00" d="M 0 681.304688 L 99.679688 973.425781 L 649.78125 736.390625 L 688.945312 681.304688 L 0 681.304688 " fill-opacity="1" fill-rule="nonzero"/><path fill="#d35a00" d="M 99.679688 973.425781 L 649.78125 736.390625 L 550.089844 843.226562 L 382.746094 933.363281 L 99.679688 973.425781 " fill-opacity="1" fill-rule="nonzero"/><path fill="#ad4e00" d="M 690.726562 704.679688 L 635.535156 774.792969 L 452.171875 1128.675781 L 631.980469 1050.222656 L 690.726562 704.679688 " fill-opacity="1" fill-rule="nonzero"/><path fill="#ad4e00" d="M 777.074219 614.542969 L 819.789062 515.628906 L 788.636719 609.53125 Z M 777.074219 614.542969 " fill-opacity="1" fill-rule="nonzero"/></svg> 
              <h1>codeCraft</h1>
            </div>
            <div className="icon-container">
            <img src={translatorIcon} alt="Translator" title="Translator" />
            <img src={feedbackIcon} alt="Feedback" title="Feedback" />
            <img src={aboutUsIcon} alt="About Us" title="About Us" />            
            <img src={githubIcon} alt="GitHub" title="GitHub" />
            <img src={profileIcon} alt="Profile" title="Profile" />                      
            </div>
          </div>
        </header>
        <div className="container main-content">
        <div className="code-container">
          <div className="code-box input-box">
            <h2>Input</h2>
            <div className="input-header">
              <div className="form-group">
                <label htmlFor="sourceLanguage">Source Language</label>
                <select className="form-control" id="sourceLanguage">
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>C++</option>
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
            <textarea 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)}
              className="code-area" 
              rows="12" 
              placeholder="Enter some code..."
            ></textarea>
          </div>
          <div className="code-box output-box">
            <h2>Output</h2>
            <div className="form-group">
              <label htmlFor="targetLanguage">Target Language</label>
              <select className="form-control" id="targetLanguage" onChange={(e) => setTargetLanguage(e.target.value)}>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="C++">C++</option>
              </select>
            </div>
            <div className="position-relative textarea-container">
            <textarea 
              value={outputText} 
              className="code-area" 
              rows="12" 
              placeholder="Translated code will appear here..."
              readOnly
            ></textarea>
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
      {/* <p>To get your profile details: </p><br />
        {profileData && <div>
              <p>Profile name: {profileData.profile_name}</p>
              <p>About me: {profileData.about_me}</p>
              <br />
            </div>
        } */}
    </div>
  );
}

export default TranslatePage;
