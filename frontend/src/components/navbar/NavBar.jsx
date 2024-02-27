import {React, useState, Link} from 'react';
import logo3 from './logo3.png';
import './NavBar.css';
import profile from '/home/hk37/CS490/CS490_project/frontend/src/components/translatepage/Profile.png'
import github from '/home/hk37/CS490/CS490_project/frontend/src/components/translatepage/github-logo.png';

const NavBar = () => {
    return(
        <div>
            <div className="banner">
            <div className="logo-container">
              <img src={logo3} height={80}/>
            </div>
            <div className="links">
              <ul>
              <li>Translator</li>  
              <li>References</li> 
              <li>Feedback</li>
              </ul>     
            </div>
            <div className='log-in'>
              <img src={github} height={40}/>
              <img src={profile} height={40} />
            </div>
          </div>
        </div>
    )
}

export default NavBar;