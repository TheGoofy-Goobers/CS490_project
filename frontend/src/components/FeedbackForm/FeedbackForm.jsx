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
            <h1>
              User Feedback Form
            </h1>
            <h2>
              Tell us how we're doing
            </h2>
          <div className="questions-container">
            <label className="question">1. The code translation was precise</label>
            <label className="question">2. The translator was easy to use</label>
            <label className="question">3. The code translation process was quick</label>
            <label className="question">4. I would use codeCraft for my coding projects again</label>
          </div>
            
            <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Strongly Disagree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Somewhat Disagree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Neutral
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Somewhat Agree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Strongly Agree
                </label>
            </div>
            <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Strongly Disagree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Somewhat Disagree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Neutral
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Somewhat Agree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Strongly Agree
                </label>
              </div>
              <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Strongly Disagree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Somewhat Disagree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Neutral
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Somewhat Agree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Strongly Agree
                </label>
              </div>
              <div className="radio-buttons">
                <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Strongly Disagree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Somewhat Disagree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Neutral
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Somewhat Agree
                </label>
                 <label>
                  <input
                    type="radio"
                    name="question1"
                    value="1"
                    checked={rating === "1"}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  Strongly Agree
                </label>
              </div>

          <div>
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

