import React, { useState, useEffect } from 'react';
import TranslatePage from './components/translatepage/TranslatePage';
import NavBar from './components/navbar/NavBar';
import Home from './components/homepage/Home' 
import './App.css'; // Assuming you have global styles here
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage.jsx';
import Register from './components/Registration/RegistrationPage.jsx'
import Feedback from './components/FeedbackForm/FeedbackForm.jsx'
import References from './components/References/References.jsx';
import Help from './components/Help/Help.jsx';
import Report from './components/report/Report.jsx';
import { isExpired } from './vars.js';
import AccountManagement from './components/AccountManagement/AccountManagement.jsx';
import ChangeUserame from './components/AccountManagement/ChangeUsername.jsx';
import ChangePassword from './components/AccountManagement/ChangePassword.jsx';
import DeleteAccount from './components/AccountManagement/DeleteAccount.jsx';
import TwoFA from './components/AccountManagement/TwoFA.jsx'
import TwoFAcode from './components/LoginPage/TwoFAcode.jsx'
import ForgotPass from './components/ForgotPass/ForgotPass.jsx';
import ResetPass from './components/ForgotPass/ResetPass.jsx'
import ReleaseNotes from './components/ReleaseNotes/ReleaseNotes.jsx';
import Loadtesting from './components/ReleaseNotes/Loadtesting.jsx'
import 'react-toastify/dist/ReactToastify.css';

function App() {
 setInterval(isExpired(), 1000); //checks every second
  return (
    <div className="App">
      <NavBar />
      <div className='routing'>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/translate' element={<TranslatePage />}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/feedback' element={<Feedback />}/>
            <Route path='/references' element={<References />}/>
            <Route path='/help' element={<Help />}/>
            <Route path='/report' element={<Report />}/>
            <Route path='/accountmanagement' element={<AccountManagement />} />
            <Route path='/accountmanagement/changeusername' element={<ChangeUserame/>}/>
            <Route path='/accountmanagement/changepassword' element={<ChangePassword />} />
            <Route path='/accountmanagement/deleteaccount' element={<DeleteAccount />} />
            <Route path='/accountmanagement/twoFA' element={<TwoFA/>} />
            <Route path='/login/2FA' element={<TwoFAcode />} />
            <Route path='/forgotpassword' element={<ForgotPass />} />
            <Route path='/resetpassword' element={<ResetPass />}/>
            <Route path='/releasenotes' element={<ReleaseNotes/>}/>
            <Route path='/releasenotes/loadtesting' element={<Loadtesting/>} />
          </Routes>
      </div>
    </div>
  );
}

export default App;