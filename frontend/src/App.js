import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import TranslatePage from './components/translatepage/TranslatePage.jsx'
import RegistrationPage from './components/Registration/RegistrationPage.jsx'; // Adjust the path as necessary
import LoginPage from './components/LoginPage/LoginPage.jsx'; // Adjust the path as necessary
import './App.css'; // Assuming you have global styles here

const Navigation = () => {
  const location = useLocation();

  // Only show the navigation bar on the register and login pages
  if (location.pathname === '/register' || location.pathname === '/login') {
    return (
      <nav>
        <Link to="/register">Register</Link> | 
        <Link to="/login">Login</Link>
      </nav>
    );
  }

  return null;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<TranslatePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;