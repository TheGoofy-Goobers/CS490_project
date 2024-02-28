import React, { useState } from 'react';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [user, setUser] = useState({
    name: '',
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
    console.log('Registration details:', user);
  };

  return (
    <div className="registration-page-container">
      <div className="registration-form-box">
        <form onSubmit={handleSubmit}>
          <h2 className="registration-form-title">Register</h2>
          <div className="registration-form-group">
            <label>Name:</label>
            <input 
              type="text" 
              name="name" 
              value={user.name} 
              onChange={handleChange} 
              className="registration-form-control"
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
