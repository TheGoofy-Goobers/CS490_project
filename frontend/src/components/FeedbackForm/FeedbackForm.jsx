import React, { useState } from 'react';
import './FeedbackForm.css';
import { FLASK_URL, SITE_URL } from '../../vars.js';
import axios from 'axios';

function FeedbackForm() {
  const [limit, setLimit] = useState(300);
  const [ratings, setRatings] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: ''
  });
  const [openended, setOpenEnded] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const feedbackData = {
      // TODO: sync user_id with session variables
      user_id: parseInt(localStorage.getItem("user_id")),
      precision_rating: parseInt(ratings.question1),
      ease_rating: parseInt(ratings.question2),
      speed_rating: parseInt(ratings.question3),
      future_use_rating: parseInt(ratings.question4),
      note: openended
    };

    axios.post(`${FLASK_URL}/submitFeedback`, feedbackData)
    .then((response) => {
      const res = response.data;
      console.log(`Response has error: ${res.hasError}`);
      if (res.hasError) console.log(`Error response: ${res.errorMessage}`);
      else console.log('Feedback submitted successfully');
      alert(`FEEDBACK SUBMITTED SUCCESFULLY!`)
      // reset form state here if successful
      setOpenEnded('');
      setRatings({
        question1: '',
        question2: '',
        question3: '',
        question4: ''
      });
      setLimit(300);
    }).catch((error) => {
      if (error.response) {
        alert(`FEEBACK NOT SUBMITTED DUE TO: ${error.response}`)
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  };

  const handleRatingChange = (question, value) => {
    setRatings(prevState => ({
      ...prevState,
      [question]: value
    }));
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= limit) {
      setOpenEnded(inputValue);
    }
  }

  if (!localStorage.getItem("isLoggedIn")) window.location.assign(`${SITE_URL}/login?redirect=true`)
  else
  {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <div className="background-page">
            <div className="title">
              User Feedback Form
            </div>
            <div className="subtitle">
              Tell us how we're doing
            </div>
            <div className="questions-container">
              <label className="question">1. The code translation was precise</label>
              <label className="question">2. The translator was easy to use</label>
              <label className="question">3. The code translation process was quick</label>
              <label className="question">4. I would use codeCraft for my coding projects again</label>
            </div>
            <div className="radio-buttons label">
              <label>strongly disagree</label>
              <label>somewhat disagree</label>
              <label>neutral</label>
              <label>somewhat agree</label>
              <label>strongly agree</label>
            </div>
            <div className="radio-buttons">
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name="question1"
                    value={value}
                    checked={ratings['question1'] === value.toString()}
                    onChange={() => handleRatingChange('question1', value.toString())}
                  />
                </label>
              ))}
            </div>
            <div className="radio-buttons">
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name="question2"
                    value={value}
                    checked={ratings['question2'] === value.toString()}
                    onChange={() => handleRatingChange('question2', value.toString())}
                  />
                </label>
              ))}
            </div>
            <div className="radio-buttons">
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name="question3"
                    value={value}
                    checked={ratings['question3'] === value.toString()}
                    onChange={() => handleRatingChange('question3', value.toString())}
                  />
                </label>
              ))}
            </div>
            <div className="radio-buttons">
              {[1, 2, 3, 4, 5].map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name="question4"
                    value={value}
                    checked={ratings['question4'] === value.toString()}
                    onChange={() => handleRatingChange('question4', value.toString())}
                  />
                </label>
              ))}
            </div>
            <div className="other-container">
              <label>Other:</label>
              <textarea
                className="textbox"
                value={openended}
                onChange={handleChange}
                placeholder={`Type here (Limit: ${limit} characters)`}
                rows={4}
                cols={50}
              />
              <div>
                Character Count: {openended.length}/{limit}
              </div>
            </div>
            <button className="submit-button" type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default FeedbackForm;
