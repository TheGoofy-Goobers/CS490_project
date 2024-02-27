import React, { useState } from 'react';
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>1. The code translation was precise</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="1">strongly disagree</option>
          <option value="2">somewhat disagree</option>
          <option value="3">neither agree or disagree</option>
          <option value="4">somewhat agree</option>
          <option value="5">strongly agree</option>
        </select>
      </div>
      <div>
        <label>Other:</label>
        <textarea
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
      <button type="submit">Submit</button>
    </form>
  );
}

export default FeedbackForm;
