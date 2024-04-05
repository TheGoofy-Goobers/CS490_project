import React, { useState, useEffect } from 'react';
import { SITE_URL, FLASK_URL, setSessionLogin, isExpired, Logout } from '../../vars';
import axios from 'axios';
import './AccountManagement.css';
import { Link } from 'react-router-dom';
import SHA256 from 'crypto-js/sha256';


const ChangePassword = () => {

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

    const changePass = () => {
        const hashedPassword = SHA256(newPass.current + "CS490!").toString();
        const newhash = SHA256(newPass.new + "CS490!").toString();
        const user = sessionStorage.getItem("sessionToken");
        const check = {
            currPass: hashedPassword,
            newPass: newhash,
            user_id: user,
        };

        if (newPass.new != newPass.conf) {
            alert(`New and confirmed are different. Change it to match!`);
            return;
        }

        axios.post(`${FLASK_URL}/userChangePassword`, check)
            .then((response) => {
                const res = response.data;
                if (res.success) {
                    delete newPass.conf;
                    delete newPass.current;
                    delete newPass.new;
                    alert(`NEW PASSWORD CHANGED SUCCESSFUL!`);
                }
                if (res.hasError) console.log(`Error response: ${res.errorMessage}`);
                console.log(`Response has error: ${res.hasError}`);
                if (res.Logout) {
                    alert("Please login again.")
                    Logout()
                }
            }).catch((error) => {
                if (error.response) {
                    if (error.response == '500 (INTERNAL SERVER ERROR)') {
                        alert(`BACKEND FAILED`);
                    }
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };


    return(
        <div>
            <div className="delete-box-container">
                <div className='login-form-box'>
                    <form onSubmit={handlePassSubmit}>
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