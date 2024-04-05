import React, { useState } from 'react';
import axios from 'axios'
import { FLASK_URL, SITE_URL, setSessionLogin } from '../../vars';
import './RegistrationPage.css';
import SHA256 from 'crypto-js/sha256';
import { useNavigate } from 'react-router-dom'
import { setLocal } from '../../vars';

const RegistrationPage = () => {

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  // use this if toast breaks again lmfao

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateUsername()) {
      alert("Username must be between 8 to 24 characters and can only contain alphanumeric characters, underscores, and hyphens.");
      return;
    }
    if (!validateEmail()) {
      alert("Please enter a valid email address.");
      return;
    }

     if (!validatePassword(user.password)) {
      alert('Password must be at least 8 characters long, have a special character, and number.')
      return;
     }

    register();
    console.log('Registration details:', user);
  };

  const validateUsername = () => {
    return /^(?=[a-zA-Z0-9_])(?!.*?_{2,})[a-zA-Z0-9_-]{8,24}$/.test(user.username);
  }

  const validateEmail = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email);
  }

  const validatePassword = () => {
    const password = user.password || '';
    // Check if password length is at least 8 characters
    if (password.length < 8) {
      return false;
    }
    // Check if password contains at least one number
    if (!/\d/.test(password)) {
      return false;
    }
    // Check if password contains at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return false;
    }
    return true;
  }

  var res
  const register = () => {
    
    const hashedPassword = SHA256(user.password + "CS490!").toString()
    delete user.password
    const userData = {
      ...user,
      password: hashedPassword
    };

    axios.post(`${FLASK_URL}/registerNewUser`, userData)
    .then((response) => {
      res = response.data
      if (res.success) {
        alert("Registration Success!");
        setLocal(res.sessionToken, user.username, Math.floor(Date.now() / 1000))
        delete user.username 
        delete user.email
        navigate('/')
        window.location.reload();
      }
      console.log(`Response has error: ${res.hasError}`)
      if(res.usernameErrors) console.log(`Username errors: ${res.usernameErrors}`)
      if(res.emailErrors) console.log(`Email errors: ${res.emailErrors}`)
      if(res.errorMessage) console.log(`Other errors: ${res.errorMessage}`)
      if(res.sqlErrors && res.sqlErrors.length > 0) {
        alert(`${res.sqlErrors}`)
        console.log(`SQL Errors: ${res.sqlErrors}`)
      }
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  if(localStorage.getItem("isLoggedIn")) window.location.assign(`${SITE_URL}?redirect=true`)
  else
  {  
    return (
      <div className="registration-page-container">
        <div className="registration-form-box">
          <form onSubmit={handleSubmit}>
            <h2 className="registration-form-title">Register</h2>
            <div className="registration-form-group">
              <label>Username:</label>
              <input 
                type="text" 
                name="username" 
                value={user.username} 
                onChange={handleChange} 
                className="registration-form-control"
                required
              />
            </div>
            <div className="registration-form-group">
              <label>Email:</label>
              <input 
                type="email" 
                name="email" 
                value={user.email} 
                onChange={handleChange} 
                className="registration-form-control"
                required
              />
            </div>
            <div className="registration-form-group">
              <label>Password:</label>
              <input 
                type="password" 
                name="password" 
                value={user.password} 
                onChange={handleChange} 
                className="registration-form-control"
                required
              />
            </div>
            <div className="registration-button-container">
              <button type="submit" className="registration-form-button">Register</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default RegistrationPage;
