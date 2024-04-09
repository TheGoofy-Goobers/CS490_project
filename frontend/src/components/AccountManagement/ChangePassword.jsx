import React, { useState, useEffect } from 'react';
import { SITE_URL, FLASK_URL, setSessionLogin, isExpired, Logout } from '../../vars';
import axios from 'axios';
import './AccountManagement.css';
import { Link } from 'react-router-dom';
import AlertBox from '../AlertBox/AlertBox';
import SHA256 from 'crypto-js/sha256';


const ChangePassword = () => {
    const [message, setMessage] = useState('Default message');
    const [alertOpen, setAlertOpen] = useState(false);

    const showAlert = () => {
        setAlertOpen(true);
    
        // Optionally, automatically close the alert after some time
        setTimeout(() => {
          setAlertOpen(false);
        }, 2000); // This should match the duration in AlertBox or be longer
      };
    
    const [newPass, setPass] = useState({
        current: '',
        new: '',
        conf: '',
    });

    const handlePassChange = (e) => {
        const { name, value } = e.target;
        setPass({ ...newPass, [name]: value });
    };

    const handlePassSubmit = (e) => {
        e.preventDefault();
        changePass();
    };

    const validatePassword = (pass) => {
        const password = pass || '';
        // Check if password length is at least 8 characters
        if (password.length < 8) {
          return false;
        }
        // Check if password contains at least one number
        if (!/\d/.test(password)) {
          return false;
        }
        // Check if password contains at least one special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          return false;
        }
        return true;
      }
    
    const changePass = () => {
        const hashedPassword = SHA256(newPass.current + "CS490!").toString();
        const newhash = SHA256(newPass.new + "CS490!").toString();
        const user = localStorage.getItem("sessionToken");
        const check = {
            currPass: hashedPassword,
            newPass: newhash,
            sessionToken: user,
        };

        if (newPass.new != newPass.conf) {
            setMessage(`New and confirmed are different. Change it to match!`);
            showAlert();
            return;
        }

        if (!validatePassword(newPass.new)) {
            setMessage(`Password must be at least 8 characters long, have a special character, and number.`);
            showAlert();
            return;
           }

        axios.post(`${FLASK_URL}/userChangePassword`, check)
            .then((response) => {
                const res = response.data;
                if (res.success) {
                    delete newPass.conf;
                    delete newPass.current;
                    delete newPass.new;
                    setMessage(`NEW PASSWORD CHANGED SUCCESSFUL!`);
                    showAlert()
                }
                if (res.hasError) console.log(`Error response: ${res.errorMessage}`);
                console.log(`Response has error: ${res.hasError}`);
                if (res.logout) {
                    setMessage(`Session expired. Please login again.`)
                    showAlert();
                    setTimeout(Logout, 4000)
                }
            }).catch((error) => {
                if (error.response) {
                    if (error.response == '500 (INTERNAL SERVER ERROR)') {
                        setMessage(`BACKEND FAILED contact support`);
                        showAlert();
                    }
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };


    return(
        <div>
            {<AlertBox message={message} isOpen={alertOpen} />}
            <div className="delete-box-container">
                <div className='login-form-box'>
                    <form onSubmit={handlePassSubmit}>i 
                        <div className='change_password'>
                            <h2>Change Password</h2>
                            <p className="note">Password must be at least 8 characters long, have a special character, and number</p>
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
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;