import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { FLASK_URL, setSessionLogin } from '../../vars';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [newPass, setPass] = useState({
    new: '',
    conf: ''
  });

  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [width, setWidth] = useState();
  const user = parseInt(sessionStorage.getItem("user_id"));

  useEffect(() => {
    // Check if user is already logged in
    if (sessionStorage.getItem('isLoggedIn')) {
      setLoggedInUser(sessionStorage.getItem('username'));
      setWidth({
        maxWidth: '80rem',
        height: '40rem',
      });
    }
  }, []);

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
        setSessionLogin(res.user_id.toString())
        delete credentials.password
        alert(`Welcome to codeCraft!`)
        navigate('/'); 
      }
      if(res.hasError) console.log(`Error response: ${res.errorMessage}`)
      console.log(`Response has error: ${res.hasError}`)
    }).catch((error) => {
      if (error.response) {
        alert(`${res.errorMessage}`)
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  const logout = () => {
    sessionStorage.clear();
    //TODO: Find a new way to clear the session timer
    //clearSessionTimer();
  }

  return (
    <div>
      <div className="login-page-container">
        <div className="login-form-box" style={width}>
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
            {console.log(`Username: ${user} Email: ${credentials.username}`)}
            <div className='col_holder'>
              <div className='change_password'>
              <h2>Change Password</h2>
              <div className="login-form-group">
              <label>Current Password:</label>
              <input 
                type="text" 
                name="current" 
                value={credentials.password} 
                onChange={handleChange} 
                className="login-form-control"
              />
            </div>
            <div className="login-form-group">
              <label>New Password:</label>
              <input 
                type="password" 
                name="new_password" 
                value={credentials.password} 
                onChange={handleChange} 
                className="login-form-control"
              />
            </div>
            <div className="login-form-group">
              <label>Confirm Password:</label>
              <input 
                type="password" 
                name="new_password" 
                value={credentials.password} 
                onChange={handleChange} 
                className="login-form-control"
              />
              <div className="login-button-container">
                <button type="submit" className="login-form-button">Submit</button>
              </div>
            </div>
              </div>
              <div className='manage_prof'>
              <h2>Manage Profile</h2>
              <div>
              <h2>Change Username</h2>
              <div className="login-form-group">
              <label>Current Username:</label>
              <input 
                type="text" 
                name="current" 
                value={credentials.password} 
                onChange={handleChange} 
                className="login-form-control"
              />
            </div>
            <div className="login-form-group">
              <label>New Username:</label>
              <input 
                type="password" 
                name="new_password" 
                value={credentials.password} 
                onChange={handleChange} 
                className="login-form-control"
              />
            </div>
              <div className="login-button-container">
                <button type="submit" className="login-form-button">Submit</button>
              </div>
              </div>
              </div>
            </div>
            <h2>Sorry to see you go {loggedInUser}!</h2> 
            <form onSubmit={handleLogout}>
                <div className="login-button-container">
                  <button type="submit" className="login-form-button">Logout</button>
                </div>
            </form>
            <form className='space'>
              <div>
                <button type='submit' className='delete-form-button'>Delete Account</button>
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
