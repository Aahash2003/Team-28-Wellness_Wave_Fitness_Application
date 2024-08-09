import React, { Component } from 'react';
import { Box } from '@mui/material';
import LogCalories from './LogCalories';
import ViewCalories from './ViewCalories';
import FoodSearch from './FoodSearch';
import axios from 'axios';

class CaloriePage extends Component {
  state = {
    calories: [],
    email: localStorage.getItem('email'),
  };

  componentDidMount() {
    this.fetchCalories();
  }

  // Function to fetch calorie logs
  fetchCalories = async () => {
    const { email } = this.state;
    try {
      const response = await axios.get(`http://localhost:8080/api/calories/user/${email}/calories`);
      this.setState({ calories: response.data });
    } catch (error) {
      console.error('Error fetching calorie data:', error);
      alert('Error fetching calorie data');
    }
  };

  // Function to handle a new log being successfully added
  handleLogSuccess = () => {
    this.fetchCalories();
  };

  // Function to handle a log being deleted
  handleDeleteSuccess = () => {
    this.fetchCalories();
  };

  handleFoodSuccess = () => {
    this.fetchCalories();
  }

  render() {
    const { calories } = this.state;

    return (
      <Box className="calories-page-container">
        <h1>Calories Management</h1>
        <Box className="calories-page-section">
          <FoodSearch onFoodSuccess={this.handleFoodSuccess}/>
        </Box>
        <Box className="calories-page-section">
          <LogCalories onLogSuccess={this.handleLogSuccess} />
        </Box>
        <Box className="calories-page-section">
          <ViewCalories calories={calories} onDeleteSuccess={this.handleDeleteSuccess} />
        </Box>
      </Box>
    );
  }
}

export default CaloriePage;
