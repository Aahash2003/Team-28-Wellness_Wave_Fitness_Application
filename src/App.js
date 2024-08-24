import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ChakraProvider } from '@chakra-ui/react';

import './App.css';
import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import EmailVerify from './components/EmailVerify';
import WorkoutLog from './components/WorkoutPage/workout';
import WorkoutLogger from './components/WorkoutPage/workout';
import CaloriePage from './components/CalorieLog/CaloriePage';
import Profile from './components/profile/Profile';
import CalorieCalc from './components/CalorieCalculator/CalorieCalc';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Box className="app-container">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Box className="content-container">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/exercise/:id" element={isAuthenticated ? <ExerciseDetail /> : <Navigate replace to="/login" />} />
          <Route path="/#exercises" element={isAuthenticated ? <ExerciseDetail /> : <Navigate replace to="/login" />} />
          <Route path="/Calories" element={isAuthenticated ? <CaloriePage /> : <Navigate replace to="/login" />} />
          <Route path="/workout" element={isAuthenticated ? <WorkoutLog /> : <Navigate replace to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={isAuthenticated ? <Navigate replace to="/home" /> : <Login />} />
          <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
          <Route path="/api/workout/user/:email/workouts" element={isAuthenticated ? <Navigate replace to="/home" /> : <WorkoutLogger />} />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <ChakraProvider>
                  <Profile />
                </ChakraProvider>
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/calc"
            element={
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
      <Footer />
    </Box>
  );
};

export default App;
