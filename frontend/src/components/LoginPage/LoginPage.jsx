import React, { useState } from 'react';
import './LoginPage.css';
import { FLASK_URL } from '../../vars';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    login()
    console.log('Login credentials:', credentials);
  };

  // TODO: handle login response and redirection on front end
  var res
  const login = () => {
    const hashedPassword = SHA256(credentials.password).toString();
    const loginData = {
      ...credentials,
      password: hashedPassword,
    };

    axios.post(`${FLASK_URL}/userLoginCredentials`, loginData)
    .then((response) => {
      res = response.data
      if (res.success) {
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('userId', res.user_id.toString())
        const sessionToken = uuidv4();
        sessionStorage.setItem('sessionToken', sessionToken)
        delete credentials.username
        delete credentials.password
      }
      console.log(`Response has error: ${res.hasError}`)
      if(res.hasError) console.log(`Error response: ${res.errorMessage}`)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="login-form-group">
            <label>Username or Email:</label>
            <input 
              type="text" 
              name="username" 
              value={credentials.username} 
              onChange={handleChange} 
              className="login-form-control"
            />
          </div>
          <div className="login-form-group">
            <label>Password:</label>
            <input 
              type="password" 
              name="password" 
              value={credentials.password} 
              onChange={handleChange} 
              className="login-form-control"
            />
          </div>
          <div className="login-button-container">
            <button type="submit" className="login-form-button">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
