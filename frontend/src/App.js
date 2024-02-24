import React from 'react';
import { useState } from 'react'
import TranslatePage from './components/translatepage/TranslatePage';
import axios from "axios";
import './App.css'; // Assuming you have global styles here
import { FLASK_URL } from './vars.js'

function App() {

  const [profileData, setProfileData] = useState(null)
  
  function getData() {
    axios({
      method: "GET",
      url:`${FLASK_URL}/profile`,
    })
    .then((response) => {
      const res =response.data
      console.log(res)
      setProfileData(({
        profile_name: res.name,
        about_me: res.about}))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

  return (
    <div className="App">
      <TranslatePage />

      <p>To get your profile details: </p><button onClick={getData}>Click me</button>
        {profileData && <div>
              <p>Profile name: {profileData.profile_name}</p>
              <p>About me: {profileData.about_me}</p>
            </div>
        }
    </div>
  );
}

export default App;