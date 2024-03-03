import React, { useState } from 'react';
import './FeedbackForm.css';
import { FLASK_URL } from '../../vars.js'

function FeedbackForm() {
  const [limit, setLimit] = useState(300);
  const [rating, setRating] = useState('');
  const [openended, setOpenEnded] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // reset
    setOpenEnded('');
    setRating('');
    setLimit(300);
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= limit){
      setOpenEnded(inputValue);
    // throw error
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="background-page">
          <div className = "title">
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
          <div className = "radio-buttons label">
            <label>strongly disagree</label>
            <label>somewhat disagree</label>
            <label>neutral</label>
            <label>somewhat agree</label>
            <label>strongly agree</label>
          </div>
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                name="question1"
                value="1"
                checked={rating === "1"}
                onChange={(e) => setRating("1")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question1"
                value="1"
                checked={rating === "2"}
                onChange={(e) => setRating("2")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question1"
                value="1"
                checked={rating === "3"}
                onChange={(e) => setRating("3")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question1"
                value="1"
                checked={rating === "4"}
                onChange={(e) => setRating("4")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question1"
                value="1"
                checked={rating === "5"}
                onChange={(e) => setRating("5")}
              />
            </label>
          </div>
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                name="question2"
                value="1"
                checked={rating === "1"}
                onChange={(e) => setRating("1")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="2"
                checked={rating === "2"}
                onChange={(e) => setRating("2")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="3"
                checked={rating === "3"}
                onChange={(e) => setRating("3")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="4"
                checked={rating === "4"}
                onChange={(e) => setRating("4")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question2"
                value="5"
                checked={rating === "5"}
                onChange={(e) => setRating("5")}
              />
            </label>
          </div>
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                name="question3"
                value="1"
                checked={rating === "1"}
                onChange={(e) => setRating("1")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question3"
                value="2"
                checked={rating === "2"}
                onChange={(e) => setRating("2")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question3"
                value="3"
                checked={rating === "3"}
                onChange={(e) => setRating("3")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question3"
                value="4"
                checked={rating === "4"}
                onChange={(e) => setRating("4")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question3"
                value="5"
                checked={rating === "5"}
                onChange={(e) => setRating("5")}
              />
            </label>
          </div>
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                name="question4"
                value="1"
                checked={rating === "1"}
                onChange={(e) => setRating("1")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question4"
                value="2"
                checked={rating === "2"}
                onChange={(e) => setRating("2")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question4"
                value="3"
                checked={rating === "3"}
                onChange={(e) => setRating("3")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question4"
                value="4"
                checked={rating === "4"}
                onChange={(e) => setRating("4")}
              />
            </label>
            <label>
              <input
                type="radio"
                name="question4"
                value="5"
                checked={rating === "5"}
                onChange={(e) => setRating("5")}
              />
            </label>
          </div>
          <div className = "other-container">
            <label>Other:</label>
            <textarea className = "textbox"
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
          <button className = "submit-button" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default FeedbackForm;

