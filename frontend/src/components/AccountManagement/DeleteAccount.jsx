import React, { useState, useEffect } from 'react';
import { SITE_URL, FLASK_URL, setSessionLogin, isExpired, Logout } from '../../vars';
import axios from 'axios';
import './AccountManagement.css';
import AlertBox from '../AlertBox/AlertBox';
import { Link } from 'react-router-dom';

const DeleteAccount = () => {
    const [message, setMessage] = useState('Default message');
    const [alertOpen, setAlertOpen] = useState(false);

    const showAlert = () => {
        setAlertOpen(true);
    
        // Optionally, automatically close the alert after some time
        setTimeout(() => {
          setAlertOpen(false);
        }, 2000); // This should match the duration in AlertBox or be longer
      };

    const handleDelete = (e) => {
        e.preventDefault();
        deleteAccount()
    }
    
    const deleteAccount = () => {
        const user = localStorage.getItem("sessionToken");

        axios.post(`${FLASK_URL}/deleteAccount`, { sessionToken: user })
            .then((response) => {
                const res = response.data;
                if (res.success) {
                    setMessage(`Account deleted!`);
                    showAlert();
                    setTimeout(Logout, 4000);
                    setTimeout(() => {window.location.href = SITE_URL}, 4000);
                }
                if (res.hasError) console.log(`Error response: ${res.errorMessage}`);
                console.log(`Response has error: ${res.hasError}`);
                if (res.logout) {
                    setMessage(`Deletion failed, session expired. Please login again.`);
                    showAlert();
                    setTimeout(Logout, 2000);
                    setTimeout(() => {window.location.href = SITE_URL}, 2000);
                }
            }).catch((error, response) => {
                if (error.response) {
                    setMessage(`Backend has failed.`);
                    showAlert();
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };

    return(
        <div className="box-container">
            {<AlertBox message={message} isOpen={alertOpen} />}
            <div className='login-form-box'>
                <p className="note">Please note that once you delete your account, you cannot log back in or reactivate your account</p>
                <form onSubmit={handleDelete}>
                    <div>
                        <button type='submit' className='delete-form-button'>Delete Account</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DeleteAccount;