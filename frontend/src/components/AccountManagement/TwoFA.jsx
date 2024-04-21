import React, { useState, useRef, useEffect } from 'react';
import { SITE_URL, FLASK_URL, set2FAVerification, Logout, passIsVerified } from '../../vars';
import axios from 'axios';
import './AccountManagement.css';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../AlertBox/AlertBox';
import SHA256 from 'crypto-js/sha256';
import eyeicon from './eyeicon.svg';
import { useLocation } from 'react-router-dom';

const TwoFA = () => {


    const [message, setMessage] = useState('Default message');
    const [alertOpen, setAlertOpen] = useState(false);

    const showAlert = () => {
        setAlertOpen(true);

        // Optionally, automatically close the alert after some time
        setTimeout(() => {
            setAlertOpen(false);
        }, 2000); // This should match the duration in AlertBox or be longer
    };

    const [code, setCode] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);
    const [qrCode, setQrCode] = useState('');

    // setQrCode('SGVsbG8sIHdvcmxkIQ==');

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.post(`${FLASK_URL}/getQRCode`);
    //             setQrCode(response.data.qr);  // Set QR code in state
    //             localStorage.setItem('qrCode', response.data.qr);  // Store in localStorage
    //         } catch (error) {
    //             console.error('Error fetching QR code:', error);
    //         }
    //     };
    //     const storedQr = localStorage.getItem('qrCode');
    //     if (storedQr) {
    //         setQrCode(storedQr);  // Use stored QR code if available
    //     } else {
    //         fetchData();  // Fetch if not stored
    //     }
    // }, []);


    const handlePassChange = (e) => {
        setPass(e.target.value);
    }

    const handlePassSubmit = (e) => {
        e.preventDefault();
        checkPass();
    };

    const [pass, setPass] = useState('');
    
    const checkPass = () => {
        const hashedPassword = SHA256(pass + "CS490!").toString();
        const key = SHA256(pass + "2FAkey").toString();
        const user = localStorage.getItem("sessionToken");
        const check = {
            currPass: hashedPassword,
            key: key,
            sessionToken: user,
        };

        axios.post(`${FLASK_URL}/getQRCode`, check)
            .then((response) => {
                const res = response.data;
                if (res.success) {
                    set2FAVerification(true);
                    setQrCode(res.qr);
                    setPass('');
                    setMessage(`Password confirmed successfully!`);
                    showAlert("success");
                }
                if (res.hasError) console.log(`Error response: ${res.errorMessage}`);
                console.log(`Response has error: ${res.hasError}`);
                if (res.logout) {
                    setMessage(`Session expired. Please login again.`);
                    showAlert();
                    setTimeout(Logout, 4000);
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

    const handleInput = (index, event) => {
        const nums = [...code];
        nums[index] = event.target.value;
        setCode(nums);

        if (event.target.value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleBackspace = (index, event) => {
        if (event.key === "Backspace" && !code[index]) {
            if (index > 0) {
                inputsRef.current[index - 1].focus();
            }
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const pinValue = code.join('');
        const user = localStorage.getItem("sessionToken");
        const passcodeData = {
            sessionToken: user,
            passcode: pinValue,
        };
    
        axios.post(`${FLASK_URL}/validateSetupTOTP`, passcodeData)
            .then(response => {
                console.log('Verification response:', response.data);
                // TODO: redirect to home page and show success message
            })
            .catch(error => {
                console.error('Verification error:', error);
                // TODO: failed verification message
            });
    };

    // const resetPWverification = () => {
    //     set2FAVerification(false);
    // }

    // window.addEventListener("beforeunload", function (e) {
    //     resetPWverification();
    //     window.location.href = SITE_URL + "/AccountManagement/TwoFA";
    // });



    return (
        <div>           
                {
                    !localStorage.getItem("passIsVerified") &&
                    <div>
                        <div className="delete-box-container">
                            <div className='login-form-box'>
                                <form onSubmit={handlePassSubmit}>
                                    <div>
                                        <h2>Verify Password</h2>
                                        <p className="note">Please verify your password to setup or edit your 2-factor authentication</p>
                                        <div className="login-form-group">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                value={pass}
                                                onChange={handlePassChange}
                                                className="login-form-control"
                                            />
                                        </div>
                                        <div className="login-button-container">
                                            <button type="submit" className="login-form-button">Submit</button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                }
           
            {
                localStorage.getItem("passIsVerified") &&
                <div className="delete-box-container">
                    <form onSubmit={handleSubmit}>
                        <div className='change_password'>
                            <h2>Set up 2-factor authentication</h2>
                             <div>
                                {qrCode && <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />}
                                {!qrCode && <p>Loading QR code...</p>}
                            </div> 
                            <p className="note">Scan the above QR code with the Google Authenticator app</p>
                            <div className="login-form-group">
                                <label>Please enter your 6-digit code:</label>
                                <div className="input-container">
                                    {code.map((num, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={num}
                                            onChange={e => handleInput(index, e)}
                                            onKeyDown={e => handleBackspace(index, e)}
                                            className="login-form-control digit-input"
                                            ref={el => inputsRef.current[index] = el}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="login-button-container">
                                <button type="submit" className="login-form-button">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            }
        </div>
    );
};

export default TwoFA;
