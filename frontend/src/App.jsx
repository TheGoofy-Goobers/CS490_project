import React, { Suspense, lazy } from 'react';
import NavBar from './components/navbar/NavBar';
import './App.css'; // Assuming you have global styles here
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { isExpired } from './vars.js';
import AccountManagement from './components/AccountManagement/AccountManagement.jsx';
import ChangeUserame from './components/AccountManagement/ChangeUsername.jsx';
import ChangePassword from './components/AccountManagement/ChangePassword.jsx';
import DeleteAccount from './components/AccountManagement/DeleteAccount.jsx';
import ForgotPass from './components/ForgotPass/ForgotPass.jsx';
import ResetPass from './components/ForgotPass/ResetPass.jsx'

function App() {
  setInterval(isExpired, 1000); //checks every second

  return (
    <div className="App">
      <NavBar />
      <div className='routing'>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/translate' element={<TranslatePage />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/feedback' element={<Feedback />}/>
            <Route path='/references' element={<References />}/>
            <Route path='/help' element={<Help />}/>
            <Route path='/accountmanagement' element={<AccountManagement />} />
            <Route path='/accountmanagement/changeusername' element={<ChangeUsername />} />
            <Route path='/accountmanagement/changepassword' element={<ChangePassword />} />
            <Route path='/accountmanagement/deleteaccount' element={<DeleteAccount />} />
            <Route path='/accountmanagement/twoFA' element={<TwoFA/>} />
            <Route path='/login/2FA' element={<TwoFAcode />} />
            <Route path='/forgotpassword' element={<ForgotPass />} />
            <Route path='/resetpassword' element={<ResetPass />}/>
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
