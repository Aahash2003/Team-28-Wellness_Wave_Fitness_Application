import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

const CalorieCalc = () => {
  const [formData, setFormData] = useState({
    targetWeight: '',
    startDate: '',
    endDate: ''
  });
  const [calorieMaintenance, setCalorieMaintenance] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [error, setError] = useState('');
  const email = localStorage.getItem('email');

  useEffect(() => {
    // Fetch the caloric maintenance as soon as the component mounts
    const fetchCaloricMaintenance = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/calc/calculate/${email}`);
        const maintenanceValue = parseFloat(res.data.calorie_Maintenance).toFixed(2);
        setCalorieMaintenance(maintenanceValue);
      } catch (err) {
        setError('Error fetching caloric maintenance. Please try again later.');
        setCalorieMaintenance(null);
      }
    };

    fetchCaloricMaintenance();
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:8080/api/calc/calculate-DC/${email}`, {
        params: formData
      });
      const dailyCaloriesValue = parseFloat(res.data.dailyCalories).toFixed(2);
      setDailyCalories(dailyCaloriesValue);
      setError('');
    } catch (err) {
      setError('Error calculating daily calories. Please check your input and try again.');
      setDailyCalories(null);
    }
  };

  const handleStoreValue = (value) => {
    if (value) {
      localStorage.setItem('dailyCalories', value);
      alert('Daily Caloric Intake stored successfully!');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg">
      <Heading as="h1" size="lg" mb={6}>
        Daily Calorie Calculator
      </Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl id="targetWeight" isRequired>
            <FormLabel>Target Weight (kg)</FormLabel>
            <Input
              type="number"
              name="targetWeight"
              value={formData.targetWeight}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="startDate" isRequired>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="endDate" isRequired>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </FormControl>
          <Button colorScheme="blue" type="submit">
            Calculate Daily Calories
          </Button>
        </Stack>
      </form>
      {calorieMaintenance !== null && (
        <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
          <Text><strong>Caloric Maintenance:</strong> {calorieMaintenance} calories/day</Text>
          <Button colorScheme="blue" onClick={() => handleStoreValue(calorieMaintenance)}>
            Set As Daily Caloric Intake
          </Button>
        </Box>
      )}
      {dailyCalories !== null && (
        <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
          <Text><strong>Daily Caloric Intake to Reach Goal:</strong> {dailyCalories} calories/day</Text>
          <Button colorScheme="blue" onClick={() => handleStoreValue(dailyCalories)}>
            Set As Daily Caloric Intake
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CalorieCalc;
