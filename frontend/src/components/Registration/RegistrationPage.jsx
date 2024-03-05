import React, { useState } from 'react';
import axios from 'axios'
import { FLASK_URL } from '../../vars';
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
    const salt = uuidv4(); // Generate random salt NEW
    const saltedPassword = user.password + salt; // Combine salt and password NEW
    // TODO: client side validation for username/email/password- password should be encrypted client side before being sent to the server
    const hashedPassword = SHA256(saltedPassword).toString()
    // was const hashedPassword = SHA256(saltedPassword).toString();
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
        delete user.password
      }
      // TODO: Handle registration response and redirection on front end
      console.log(`Response has error: ${res.hasError}`)
      if(res.usernameErrors) console.log(`Username errors: ${res.usernameErrors}`)
      if(res.emailErrors) console.log(`Email errors: ${res.emailErrors}`)
      if(res.sqlErrors) console.log(`SQL Errors: ${res.sqlErrors}`)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

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
};

export default RegistrationPage;
