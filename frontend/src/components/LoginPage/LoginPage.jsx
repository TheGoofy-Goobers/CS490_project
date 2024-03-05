import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { FLASK_URL } from '../../vars';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [sessionTimer, setSessionTimer] = useState(null); // State to store the session timer

  useEffect(() => {
    // Check if user is already logged in
    if (sessionStorage.getItem('isLoggedIn')) {
      setLoggedInUser(sessionStorage.getItem('username'));
      startSessionTimer(); // Start the session timer when the user is logged in
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    resetSessionTimer();
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
        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('userId', res.user_id.toString())
        const sessionToken = uuidv4();
        sessionStorage.setItem('sessionToken', sessionToken)
        setLoggedInUser(credentials.username);
        delete credentials.username
        delete credentials.password
        //history.push('/');
        navigate('/'); 

        startSessionTimer();
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
    sessionStorage.clear();
    clearSessionTimer();
  }

  const startSessionTimer = () => {
    // Set a timeout for one hour (in milliseconds)
    const timer = setTimeout(() => {
      // Automatically log out the user after one hour
      logout();
      console.log('User timed out');
    }, 60 * 60 * 1000); // 1 hour

    // Store the timer ID in the state
    setSessionTimer(timer);
  };

  const resetSessionTimer = () => {
    // Clear the existing timer and start a new one on user interaction
    clearSessionTimer();
    startSessionTimer();
  };

  const clearSessionTimer = () => {
    // Clear the session timer if it exists
    if (sessionTimer) {
      clearTimeout(sessionTimer);
      setSessionTimer(null);
    }
  };

  return (
    <div>
      
      <div className="login-page-container">
        <div className="login-form-box">
          {!sessionStorage.getItem("isLoggedIn") &&
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
            <a href='/register'>
              Don't have an account? Register here
            </a>
            <div className="login-button-container">
              <button type="submit" className="login-form-button">Login</button>
            </div>
          </form>
          }
          {
          sessionStorage.getItem("isLoggedIn") &&
          <div>
            <h2>Sorry to see you go{loggedInUser}!</h2> 
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
