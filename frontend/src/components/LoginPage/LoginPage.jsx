import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { FLASK_URL, setLocal, isExpired, Logout } from '../../vars';
import axios from 'axios';
import SHA256 from 'crypto-js/sha256';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import eyeicon from './eyeicon.svg';
import AlertBox from '../AlertBox/AlertBox';


const LoginPage = () => {
  const [message, setMessage] = useState('Default message');
  const [alertOpen, setAlertOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [width, setWidth] = useState();

  const showAlert = () => {
    setAlertOpen(true);

    // Optionally, automatically close the alert after some time
    setTimeout(() => {
      setAlertOpen(false);
    }, 2000); // This should match the duration in AlertBox or be longer
  };

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
          setMessage(`Welcome to codeCraft!`);
          showAlert();
          setTimeout(() => {
            window.location.href = '/';}, 2000)
        }
        if (res.hasError) {
          console.log(`Error response: ${res.errorMessage}`);
          setMessage(`${res.errorMessage}`)
          showAlert();
        }
        console.log(`Response has error: ${res.hasError}`);
      }).catch((error) => {
        if (error.response) {
          setMessage(`${error.response}`)
          showAlert();
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  return (

    <div>
    {<AlertBox message={message} isOpen={alertOpen} />}
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
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'}
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
              <p><a href='/register'>
                Don't have an account? Register here
              </a></p>
              <a href='/forgotpassword'>
                Forgot password?
              </a>
              <div className="login-button-container">
                <button type="submit" className="login-form-button">Login</button>
              </div>
            </div>
            </form>
          }
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
