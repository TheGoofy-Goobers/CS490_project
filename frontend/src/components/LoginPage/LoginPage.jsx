import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { FLASK_URL, setLocal, isExpired, Logout } from '../../vars';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import eyeicon from './eyeicon.svg';


const LoginPage = () => {

  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [width, setWidth] = useState();

  useEffect(() => {
    // Check if user is already logged in
    if (sessionStorage.getItem('isLoggedIn')) {
      setLoggedInUser(sessionStorage.getItem('username'));
      setWidth({
        maxWidth: '100rem',
        height: '50rem',
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    login();
    console.log('Login credentials:', credentials);
  };

  var res;
  const login = () => {
    const hashedPassword = SHA256(credentials.password + "CS490!").toString();
    delete credentials.password
    const loginData = {
      ...credentials,
      password: hashedPassword,
    };

    axios.post(`${FLASK_URL}/userLoginCredentials`, loginData)
      .then((response) => {
        res = response.data
        if (res.success) {
          setLocal(res.sessionToken, credentials.username, Math.floor(Date.now() / 1000), credentials.rememberMe);
          delete credentials.username;
          delete credentials.password;
          alert(`Welcome to codeCraft!`);
          navigate('/');
          window.location.reload();
        }
        if (res.hasError) console.log(`Error response: ${res.errorMessage}`);
        console.log(`Response has error: ${res.hasError}`);
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };



  


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
                  type={showPassword ? 'text' : 'password'}
                  // type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="login-form-control"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="show-password-button"
                >
                  <img src={eyeicon} className='eye-icon' alt="eyeicon" />
                </button>
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
