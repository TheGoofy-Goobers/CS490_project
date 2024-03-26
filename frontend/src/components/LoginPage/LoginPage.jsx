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
    current: '',
    new: '',
    conf: '',
  });

  const [newUser, setUser] = useState({
    current: '',
    new: '',
  })

  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [width, setWidth] = useState();

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

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPass({ ...newPass, [name]: value });
  };

  const handlePassSubmit = (e) => {
    e.preventDefault();
    changePass();
  }

  const changePass = () => {
    const hashedPassword = SHA256(newPass.current + "CS490!").toString();
    const newhash = SHA256(newPass.new + "CS490!").toString();
    const user = parseInt(sessionStorage.getItem("user_id"));
    const check = {
      currPass: hashedPassword,
      newPass: newhash,
      user_id: user,
    };

    if(newPass.new != newPass.conf){
      alert(`New and confirmed are different. Change it to match!`)
      return;
    }
    
    axios.post(`${FLASK_URL}/userChangePassword`, check)
    .then((response) => {
        res = response.data
        if (res.success){
          delete newPass.conf
          delete newPass.current
          delete newPass.new
          alert(`NEW PASSWORD CHANGED SUCCESSFUL!`)
        }
    }).catch((error) => {
      if (error.response) {
        alert(`${error.response}}`)
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...newUser, [name]: value });
  }

  const handleUserSubmit = (e) => {
    e.preventDefault();
    changeUser();
  }
  const changeUser = () => {
    const user = parseInt(sessionStorage.getItem("user_id"));
    const sendUser = {
      ...newUser,
      user_id: user
    }
    axios.post(`${FLASK_URL}/userChangePassword`, sendUser)
    .then((response) => {
      res = response.data
      if (res.success) {
        delete newUser.current
        delete newUser.new
        alert(`USERNAME CHANGED!`)
      }
    }).catch((error) => {
      if (error.response) {
        if(error.response==500){
          alert(`BACKEND FAILED`)
        }
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
  }

  // TODO: handle login response and redirection on front end
  var res
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
        setSessionLogin(res.user_id.toString())
        delete credentials.password
        delete credentials.email
        alert(`Welcome to codeCraft!`)
        navigate('/'); 
      }
      if(res.hasError) console.log(`Error response: ${res.errorMessage}`)
      console.log(`Response has error: ${res.hasError}`)
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
    //TODO: Find a new way to clear the session timer
    //clearSessionTimer();
  }

  const deleteAccount = () => {
    const user = parseInt(sessionStorage.getItem("user_id"));

    axios.post(`${FLASK_URL}/deleteAccount`, user)
    .then((response) => {
      res = response.data
      if (res.success) {
        setSessionLogin(res.user_id.toString())
        delete credentials.password
        delete credentials.email
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
            <div className='col_holder'>
            <form onSubmit={handlePassSubmit}>
              <div className='change_password'>
              <h2>Change Password</h2>
              <div className="login-form-group">
              <label>Current Password:</label>
              <input 
                type="password" 
                name="current" 
                value={newPass.current} 
                onChange={handlePassChange} 
                className="login-form-control"
              />
              </div>
              <div className="login-form-group">
              <label>New Password:</label>
              <input 
                type="password" 
                name="new" 
                value={newPass.new} 
                onChange={handlePassChange} 
                className="login-form-control"
              />
              </div>
              <div className="login-form-group">
              <label>Confirm Password:</label>
              <input 
                type="password" 
                name="conf" 
                value={newPass.conf} 
                onChange={handlePassChange} 
                className="login-form-control"
              />
              <div className="login-button-container">
                <button type="submit" className="login-form-button">Submit</button>
              </div>
              </div>
              </div>
              </form>
              <div className='manage_prof'>
              <h2>Manage Profile</h2>
              <div>
              <h2>Change Username</h2>
              <form onSubmit={handleUserSubmit}>
              <div className="login-form-group">
              
              <label>Current Username:</label>
              <input 
                type="text" 
                name="current" 
                value={newUser.current} 
                onChange={handleUserChange} 
                className="login-form-control"
              />
            </div>
            <div className="login-form-group">
              <label>New Username:</label>
              <input 
                type="text" 
                name="new" 
                value={newUser.new} 
                onChange={handleUserChange} 
                className="login-form-control"
              />
            </div>
              <div className="login-button-container">
                <button type="submit" className="login-form-button">Submit</button>
              </div>
              </form>
              </div>
              </div>
            </div>
            <h2>Sorry to see you go {loggedInUser}!</h2> 
            <form onSubmit={handleLogout}>
                <div className="login-button-container">
                  <button type="submit" className="login-form-button">Logout</button>
                </div>
            </form>
            <div className='space'>
            <form onSubmit={deleteAccount}>
              <div>
                <button type='submit' className='delete-form-button'>Delete Account</button>
              </div>
            </form>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
