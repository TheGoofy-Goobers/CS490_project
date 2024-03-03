import React from 'react';
import TranslatePage from './components/translatepage/TranslatePage';
import NavBar from './components/navbar/NavBar';
import Home from './components/homepage/Home' 
import './App.css'; // Assuming you have global styles here
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage.jsx';
import Register from './components/Registration/RegistrationPage.jsx'

function App() {
  return (
    <div className="App">
      <NavBar />
      <div className='routing'>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/translate' element={<TranslatePage />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/register' element={<Register />}/>
          </Routes>
      </div>
    </div>
  );
}

export default App;