import React, { useState, useRef } from 'react';
import { SITE_URL, FLASK_URL, setSessionLogin, setLocal, isExpired, Logout } from '../../vars';
import axios from 'axios';
import './AccountManagement.css';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../AlertBox/AlertBox';

const TwoFA = () => {
    const [code, setCode] = useState(Array(6).fill(""));
    const inputsRef = useRef([]);
    const [qrCode, setQrCode] = useState('');

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(`${FLASK_URL}/getQRCode`); 
    //             setQrCode(response.data.qr);  // Assuming 'qr' is the key where QR data is stored
    //         } catch (error) {
    //             console.error('Error fetching QR code:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    setQrCode();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(code.join(''));
    };

    return (
        <div>
            <div className="delete-box-container">
                <form onSubmit={handleSubmit}>
                    <div className='change_password'>
                        <h2>Set up 2-factor authentication</h2>
                        <div>
                            {qrCode && <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />}
                            {!qrCode && <p>Loading QR code...</p>}
                        </div>
                        <p className="note">Get your code from your asshole bitch ass hoe</p>
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
        </div>
    );
};

export default TwoFA;
