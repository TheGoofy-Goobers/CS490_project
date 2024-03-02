import {React, useState} from 'react';
import axios from "axios";
import { FLASK_URL } from '../../vars.js'
import './TranslatePage.css';
import { FaRegClipboard, FaDownload } from 'react-icons/fa';
import aboutUsIcon from './about_us.png'; // Assuming the images are in the same directory
import feedbackIcon from './feedback.png';
import githubIcon from './github-logo.png';
import profileIcon from './Profile.png';
import translatorIcon from './translator_icon.png';

const TranslatePage = () => {
  // Functions to handle icon click events
  const handleCopyToClipboard = () => {
    // Logic to copy text to clipboard
  };

  const handleDownloadCode = () => {
    // Logic to download the code
  };

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

  return (
    <div className="translate-page">
      <div className="container main-content">
        <div className="code-container">
          <div className="code-box input-box">
            <h2>Input</h2>
            <div className="form-group">
              <label htmlFor="sourceLanguage">Source Language</label>
              <select className="form-control" id="sourceLanguage">
                <option>JavaScript</option>
                <option>Python</option>
                <option>C++</option>
              </select>
            </div>
            <textarea id="inputCode" className="code-area" rows="12" placeholder="Enter some code..."></textarea>
          </div>
          <div className="code-box output-box">
            <h2>Output</h2>
            <div className="form-group">
              <label htmlFor="targetLanguage">Target Language</label>
              <select className="form-control" id="targetLanguage">
                <option>Python</option>
                <option>JavaScript</option>
                <option>C++</option>
              </select>
            </div>
            <div className="position-relative textarea-container">
              <textarea id="outputCode" className="code-area" rows="12" placeholder="Translated code will appear here..." readOnly></textarea>
              <div className="icons">
                <FaRegClipboard className="icon" onClick={handleCopyToClipboard} />
                <FaDownload className="icon" onClick={handleDownloadCode} />
              </div>
            </div>
          </div>
        </div>
        <div className="translate-button-container">
          <button id="translateBtn" className="btn translate-button" onClick={getData}>Translate</button>
        </div>
      </div>
      <p>To get your profile details: </p><br />
        {profileData && <div>
              <p>Profile name: {profileData.profile_name}</p>
              <p>About me: {profileData.about_me}</p>
              <br />
            </div>
        }
    </div>
  );
}

export default TranslatePage;
