import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { FLASK_URL, setSessionLogin } from '../../vars';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import { setLocal, isExpired } from '../../vars';


const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value; 
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    login()
    console.log('Login credentials:', credentials);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // Handle logout logic here
    logout();
    console.log('User logged out');
    window.location.reload();
};

  // TODO: handle login response and redirection on front end
  var res
  const login = () => {
    const hashedPassword = SHA256(credentials.password + "CS490!").toString();
    const loginData = {
      ...credentials,
      password: hashedPassword,
    };

    axios.post(`${FLASK_URL}/userLoginCredentials`, loginData)
    .then((response) => {
      res = response.data
      if (res.success) {
        // setUser(credentials.username)
        setLocal(res.user_id.toString(), credentials.username, Math.floor(Date.now() / 1000), credentials.rememberMe)
        delete credentials.username
        delete credentials.password
        navigate('/');
        window.location.reload();
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

  const logout = () => {
    localStorage.clear();
  }

  const remember = () => {
    
  }

  return (
    <div> 
      <div className="login-page-container">
        <div className="login-form-box">
          {!localStorage.getItem("isLoggedIn") &&
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
             <div className="login-form-group">
                <label>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={credentials.rememberMe}
                    onChange={handleChange}
                  /> Remember Me
                </label>
              </div>
            <a href='/register'>
              Don't have an account? Register here
            </a>
            <div className="login-button-container">
              <button type="submit" className="login-form-button">Login</button>
            </div>
          </form>
          }
          {
          localStorage.getItem("isLoggedIn") &&
          <div>
            <h2>Sorry to see you go!</h2> 
            <form onSubmit={handleLogout}>
                <div className="login-button-container">
                  <button type="submit" className="login-form-button">Logout</button>
                </div>
            </form>

          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
