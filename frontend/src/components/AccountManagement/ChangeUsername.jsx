import React, { useState, useEffect } from 'react';
import { SITE_URL, FLASK_URL, setSessionLogin, setLocal, isExpired, Logout } from '../../vars';
import axios from 'axios';
import './AccountManagement.css';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../AlertBox/AlertBox';

// USERNAME CHANGING

const ChangeUserame = () => {
    const [message, setMessage] = useState('Default message');
    const [alertOpen, setAlertOpen] = useState(false);

    const showAlert = () => {
        setAlertOpen(true);
    
        // Optionally, automatically close the alert after some time
        setTimeout(() => {
          setAlertOpen(false);
        }, 2000); // This should match the duration in AlertBox or be longer
      };
    
    const [newUser, setUser] = useState({
        current: '',
        new: '',
    });

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...newUser, [name]: value });
    };

    const handleUserSubmit = (e) => {
        e.preventDefault();
        changeUser();
    };

    const changeUser = () => {
        const user = localStorage.getItem("sessionToken");
        const sendUser = {
            ...newUser,
            sessionToken: user
        };
        axios.post(`${FLASK_URL}/userChangeUsername`, sendUser)
            .then((response) => {
                const res = response.data;
                console.log(`Has error: ${res.hasError}`)
                if (res.success) {
                    localStorage.setItem("username", newUser.new);
                    setMessage(`USERNAME CHANGED!`);
                    showAlert();
                    delete newUser.current;
                    delete newUser.new;
                    setTimeout(() => { 
                        window.location.href = SITE_URL + "/accountmanagement";
                        window.location.reload();
                    }, 4000);
                }
                else if(res.hasError) {
                    console.log(`Errors: ${res.errorMessage}`)
                }
                if (res.logout) {
                    setMessage(`Session expired. Please login again.`)
                    showAlert();
                    setTimeout(Logout, 4000)
                }
            }).catch((error) => {
                if (error.response) {
                    if (error.response == 500) {
                        setMessage(`Backend failed please contact support!`)
                        showAlert();
                    }
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };


    return(
        <div className="box-container">
        {<AlertBox message={message} isOpen={alertOpen} />}
        <div className="login-form-box">
            <div className='manage_prof'>

                <div>
                    <h2>Change Username</h2>
                    <form onSubmit={handleUserSubmit}>
                        <div className="login-form-group">
                            <label>Current Username:</label>
                                <p className="note">Username must be between 8 to 24 characters and can only contain alphanumeric characters, underscores, and hyphens.</p>
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
        </div>
    )


    }


export default ChangeUserame;