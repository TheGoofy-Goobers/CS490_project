import React, { useState } from 'react';
import axios from 'axios'
import { FLASK_URL, SITE_URL, setSessionLogin } from '../../vars';
import './RegistrationPage.css';
import SHA256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';

const RegistrationPage = () => {

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    register();
    console.log('Registration details:', user);
  };

  var res
  const register = () => {
    // TODO: client side validation for username/email/password- password should be encrypted client side before being sent to the server
    // TODO: Load added string from env variables
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
        alert("Registration Success!")
        delete user.username 
        delete user.email
        setSessionLogin(res.user_id.toString())
        window.location.href = SITE_URL + "/"
      }
      // TODO: Handle registration response and redirection on front end
      console.log(`Response has error: ${res.hasError}`)
      if(res.usernameErrors) console.log(`Username errors: ${res.usernameErrors}`)
      if(res.emailErrors) console.log(`Email errors: ${res.emailErrors}`)
      if(res.sqlErrors) console.log(`SQL Errors: ${res.sqlErrors}`)
      if(res.errorMessage) console.log(`Other errors: ${res.errorMessage}`)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  if(sessionStorage.getItem("isLoggedIn")) window.location.assign(`${SITE_URL}?redirect=true`)
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
