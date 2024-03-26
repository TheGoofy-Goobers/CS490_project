import React, { useState } from 'react';
import './report.css';
import { FLASK_URL, SITE_URL } from '../../vars.js';
import axios from 'axios';

function Report() {
  // const [limit, setLimit] = useState(300);
  // const [openended, setOpenEnded] = useState('');

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const feedbackData = {
  //     note: openended
  //   };

  //   axios.post(`${FLASK_URL}/report`, feedbackData)
  //   .then((response) => {
  //     const res = response.data;
  //     console.log(`Response has error: ${res.hasError}`);
  //     if (res.hasError) console.log(`Error response: ${res.errorMessage}`);
  //     else console.log('Feedback submitted successfully');
  //     // reset form state here if successful
  //     setOpenEnded('');
      
  //     setLimit(300);
  //   }).catch((error) => {
  //     if (error.response) {
  //       console.log(error.response);
  //       console.log(error.response.status);
  //       console.log(error.response.headers);
  //     }
  //   });
  // 
  


  // const handleRatingChange = (question, value) => {
  //   setRatings(prevState => ({
  //     ...prevState,
  //     [question]: value
  //   }));
  // };

  // const handleChange = (event) => {
  //   const inputValue = event.target.value;
  //   if (inputValue.length <= limit) {
  //     setOpenEnded(inputValue);
  //   }
  // }

  if (!localStorage.getItem("isLoggedIn")) window.location.assign(`${SITE_URL}/login?redirect=true`)
  else
  {
    return (
      <div>
        <form onSubmit={handleSubmit}>
            <div className="other-container">
              <label>Tell us what errors or problems you encountered with your translation:</label>
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
        </form>
      </div>
    );
  }
}


export default Report;
