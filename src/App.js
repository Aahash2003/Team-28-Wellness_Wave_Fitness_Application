import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import './App.css';
import CaloricCounter from './pages/CaloricCounter';
import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import EmailVerify from './components/EmailVerify';
import WorkoutLog from './components/WorkoutPage/workout'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Box width="400px" sx={{ width: { xl: '1488px' }}} m="auto">
      <Navbar isAuthenticated={isAuthenticated} /> 
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
        <Route path="/exercise/:id" element={isAuthenticated ? <ExerciseDetail /> : <Navigate replace to="/login" />} />
        <Route path="/caloric-counter" element={isAuthenticated ? <CaloricCounter /> : <Navigate replace to="/login" />} />
        <Route path="/workout" element={isAuthenticated ? <WorkoutLog /> : <Navigate replace to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={isAuthenticated ? <Navigate replace to="/home" /> : <Login />} />
        <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
      </Routes>
      <Footer />
    </Box>
  );
};

export default App;
