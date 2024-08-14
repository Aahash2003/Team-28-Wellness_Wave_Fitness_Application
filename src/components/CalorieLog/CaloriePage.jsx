import React, { Component } from 'react';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import LogCalories from './LogCalories';
import ViewCalories from './ViewCalories';
import FoodSearch from './FoodSearch';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

class CaloriePage extends Component {
  state = {
    calories: [],
    email: localStorage.getItem('email'),
    selectedDate: new Date(), // Initializing the selected date to today's date
    storedCalories: localStorage.getItem('dailyCalories'), // Retrieve stored calories from localStorage
  };

  componentDidMount() {
    this.fetchCalories();
  }

  // Function to fetch calorie logs for the selected date
  fetchCalories = async () => {
    const { email, selectedDate } = this.state;
    try {
      const response = await axios.get(`http://localhost:8080/api/calories/user/${email}/calories`, {
        params: { date: selectedDate.toISOString().split('T')[0] } // Fetch logs for the selected date
      });
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
  };

  // Function to handle date selection from the calendar
  handleDateChange = (date) => {
    this.setState({ selectedDate: date }, this.fetchCalories); // Fetch calories for the new date
  };

  render() {
    const { calories, selectedDate, storedCalories } = this.state;

    return (
      <Box p={5} maxW="1200px" mx="auto">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Calories Management
        </Heading>
        
        {storedCalories && (
          <Box mb={4} p={4} borderWidth="1px" borderRadius="md" boxShadow="md" textAlign="center">
            <Text fontSize="lg">
              <strong>Stored Daily Caloric Intake:</strong> {storedCalories} calories/day
            </Text>
          </Box>
        )}
        
        <Box mb={6}>
          <Calendar
            onChange={this.handleDateChange}
            value={selectedDate}
          />
        </Box>
        <VStack spacing={6}>
          <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
            <FoodSearch selectedDate={selectedDate} onFoodSuccess={this.handleFoodSuccess} />
          </Box>
          <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
            <LogCalories selectedDate={selectedDate} onLogSuccess={this.handleLogSuccess} />
          </Box>
          <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
            <ViewCalories calories={calories} selectedDate={selectedDate} onDeleteSuccess={this.handleDeleteSuccess} />
          </Box>
        </VStack>
      </Box>
    );
  }
}

export default CaloriePage;
