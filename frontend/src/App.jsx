import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import UserProvider from './context/UserContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { Edit } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import EditResume from './components/EditResume.jsx';
import Navbar from './components/Navbar.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CreateResumeForm from './components/CreateResumeform.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';




const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/signup' || location.pathname === '/login' || location.pathname === '/';

  return (
    <UserProvider>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resume/create" element={<PrivateRoute><CreateResumeForm /></PrivateRoute>} />
          <Route path="/resume/:resumeId" element={<PrivateRoute><EditResume /></PrivateRoute>} />
      </Routes>
      <Toaster toastOptions={{
        className :"",
        style: {
          fontSize: '13px'
        }
      }}></Toaster>
    </UserProvider>
  )
}

export default App
