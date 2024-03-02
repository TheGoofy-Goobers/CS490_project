import React from 'react';
import { Link } from 'react-router-dom';
import logo3 from './logo3.png';
import './NavBar.css';
import profile from '../translatepage/Profile.png';
import github from '../translatepage/github-logo.png';

const NavBar = () => {
  return (
    <div className="nav-bar">
      <div className="nav-bar-banner">
        <div className="nav-bar-logo-container">
          <Link to={'/'}>
            <img src={logo3} height={80} alt="Logo"/>
          </Link>
        </div>
        <div className="nav-bar-links">
          <ul>
            <Link to={'/translate'}>
              <li>Translator</li>
            </Link>
            <li>References</li>
            <li>Feedback</li>
          </ul>
        </div>
        <div className='nav-bar-log-in'>
          <img src={github} height={40} alt="GitHub"/>
          <img src={profile} height={40} alt="Profile"/>
        </div>
      </div>
    </div>
  );
};

export default NavBar;