import React from 'react';
import { Link } from 'react-router-dom';
import logo3 from './logo3.png';
import './NavBar.css';
import profile from '../translatepage/Profile.png';
import github from '../translatepage/github-logo.png';


const NavBar = ({loggedInUser}) => {
  return (
    <div className="nav-bar">
      <div className="nav-bar-banner">
        <div className="nav-bar-logo-container">
          <Link to={'/'} data-testid='lin'>
            <img src={logo3} height={80} alt="Logo"/>
          </Link>
        </div>
        <div className="nav-bar-links">
          <ul>
            <Link to={'/translate'} style={{ textDecoration: 'none' }} data-testid='translink'>
              <li>Translator</li>
            </Link>
            <Link to={'/refernces'} style={{ textDecoration: 'none' }} data-testid='reflink'>
            <li>References</li>
            </Link>
            <Link to={'/feedback'} style={{ textDecoration: 'none' }} data-testid='feedlink'>
            <li>Feedback</li>
            </Link>
          </ul>
        </div>
        <div className='nav-bar-log-in'>
          {loggedInUser &&
            <div>
              <span>Welcome, {loggedInUser}!</span>
              <Link to={'/logout'}>
                <button>Logout</button>
              </Link>
            </div>
          }
          <Link to={'/login'} data-testid='prof'>
            <img src={profile} height={40} alt="Profile"/>
          </Link>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;