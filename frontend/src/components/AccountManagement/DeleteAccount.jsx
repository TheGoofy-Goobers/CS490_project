import React, { useState, useEffect } from 'react';
import { SITE_URL, FLASK_URL, setSessionLogin, isExpired, Logout } from '../../vars';
import axios from 'axios';
import './AccountManagement.css';
import { Link } from 'react-router-dom';

const DeleteAccount = () => {

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
                    alert(`Account deleted!`);
                    Logout();
                    window.location.href = SITE_URL;
                }
                if (res.hasError) console.log(`Error response: ${res.errorMessage}`);
                console.log(`Response has error: ${res.hasError}`);
                if (res.logout) {
                    alert("Deletion failed, session expired. Please login again..")
                    Logout()
                }
            }).catch((error, response) => {
                if (error.response) {
                    alert(`${response.data.errorMessage}`);//some fucky shit goin on here idk
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };

    return(
        <div className="box-container">
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