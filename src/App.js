import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ChakraProvider } from '@chakra-ui/react';
import axios from 'axios';

import './App.css';
import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import EmailVerify from './components/EmailVerify';
import WorkoutLog from './components/WorkoutPage/workout';
import CaloriePage from './components/CalorieLog/CaloriePage';
import Profile from './components/profile/Profile';
import CalorieCalc from './components/CalorieCalculator/CalorieCalc';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      axios.get(`/api/users/${userId}/verify/${token}/`)
        .then(response => {
          setIsAuthenticated(true);
        })
        .catch(error => {
          console.error('Token verification failed', error);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogin = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
    navigate('/home'); // Redirect after successful login
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while checking auth status
  }

  return (
    <Box className="app-container">
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
      <Box className="content-container">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/exercise/:id" element={isAuthenticated ? <ExerciseDetail /> : <Navigate replace to="/login" />} />
          <Route path="/Calories" element={isAuthenticated ? <CaloriePage /> : <Navigate replace to="/login" />} />
          <Route path="/workout" element={isAuthenticated ? <WorkoutLog /> : <Navigate replace to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="api/users/:id/verify/:token" element={<EmailVerify />} />
          <Route path="/profile" element={
              isAuthenticated ? (
                <ChakraProvider>
                  <Profile />
                </ChakraProvider>
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route path="/calc" element={
              isAuthenticated ? (
                <ChakraProvider>
                  <CalorieCalc />
                </ChakraProvider>
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
        </Routes>
      </Box>
      {isAuthenticated && <Footer />}
    </Box>
  );
};

export default App;
