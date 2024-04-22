import {React, useState} from 'react';
import { FLASK_URL, SITE_URL, Logout } from '../../vars.js';
import axios from 'axios';
// import './TranslateFeedback.css';

const Star = ({ selected = false, onClick }) => (
    <span onClick={onClick} style={{ cursor: 'pointer', color: selected ? 'orange' : 'gray', fontSize: '35px'}}>
        {selected ? '★' : '☆'}
    </span>
)


function TranslationFeedback(){

    const [rating, setRating] = useState('');
    const [openended, setOpenEnded] = useState('');
    const [limit, setLimit] = useState(150);

    const handleChange = (event) => {
        const inputValue = event.target.value;
        if (inputValue.length <= limit) {
            setOpenEnded(inputValue);
        }
    }

    const handleRating = (rate) => {
        setRating(rate);
        console.log(rate);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const translationFBData = {
            sessionToken: localStorage.getItem("sessionToken"),
            star_rating: parseInt(rating),
            note: openended
        };
        console.log('Sending request with data:', translationFBData);
        axios.post(`${FLASK_URL}/translationFeedback`, translationFBData)
            .then((response) => {
                const res = response.data;
                console.log(`Response has error: ${res.hasError}`);
                console.log(`Session token: ${res.sessionCheck}`)
                if (res.hasError) console.log(`Error response: ${res.errorMessage}`);
                else if (res.success) {
                    console.log('Translation Feedback submitted successfully');
                    alert(`TRANSLATION FEEDBACK SUBMITTED SUCCESFULLY!`);
                }
                if (res.logout) {
                    alert("Session expired. Please login again..");
                    Logout();
                }
                setOpenEnded('');
                setRating('');
                setLimit(150);
            }).catch((error) => {
                if (error.response) {
                    alert(`FEEBACK NOT SUBMITTED DUE TO: ${error.response}`);
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });

    }


    return (
        <div className="rating-container">
            <p className="text">Rate Translation:</p>
            <form onSubmit={handleSubmit} className="rating-form">
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star, index) => (
                        <Star
                            key={index}
                            className="star"
                            selected={rating >= star}
                            onClick={() => handleRating(star)}
                        />
                    ))}
                </div>
                <textarea
                    className="textbox"
                    value={openended}
                    onChange={handleChange}
                    placeholder={`Type here (Limit: ${limit} characters)`}
                    rows={4}
                    cols={50}
                />
                <button className="submit-button" type="submit">Submit</button>
            </form>
        </div>
    )

}

export default TranslationFeedback