import React, { useState, useEffect } from 'react';import TranslatePage from './components/translatepage/TranslatePage';
import NavBar from './components/navbar/NavBar';
import Home from './components/homepage/Home' 
import './App.css'; // Assuming you have global styles here
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage.jsx';
import Register from './components/Registration/RegistrationPage.jsx'
import Feedback from './components/FeedbackForm/FeedbackForm.jsx'
import References from './components/References/References.jsx';
import Help from './components/Help/Help.jsx';
import { ToastContainer } from 'react-toastify';

function App() {
  const [loggedInUser, setLoggedInUser] = useState('');

  return (
    <div className="App">
      <ToastContainer/>
      <NavBar loggedInUser={loggedInUser} />
      <div className='routing'>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/translate' element={<TranslatePage />}/>
            <Route path='/login' element={<LoginPage  setLoggedInUser={setLoggedInUser}/>}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/feedback' element={<Feedback />}/>
            <Route path='/refernces' element={<References />}/>
            <Route path='/help' element={<Help />}/>
          </Routes>
      </div>
    </div>
  );
}

export default App;