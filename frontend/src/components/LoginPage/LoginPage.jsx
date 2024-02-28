import React, { useState } from 'react';
import './LoginPage.css';

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
    console.log('Login credentials:', credentials);
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="login-form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={credentials.email} 
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
