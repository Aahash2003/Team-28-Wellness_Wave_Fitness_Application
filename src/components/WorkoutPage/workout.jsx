import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CreateCategory from './CreateCategory';
import CategoryCard from './CategoryCard';
import HorizontalScrollbar from './HorizontalScrollBar';
import './Workout.css'; // Import the CSS file for styling
import {Box, Heading, Input, Text, Button, Grid, Alert, AlertIcon,} from '@chakra-ui/react';
import { Stack } from '@mui/material';
const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';




const WorkoutLogger = () => {
  const email = localStorage.getItem('email'); // Local storage set in the login

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [workoutsByCategory, setWorkoutsByCategory] = useState([]);
  const [error, setError] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null); // New state for selected workout
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '', weight: '', restTime: '', currentRepMax: '', oneRepMax: '' }
  ]);
  const [workouts, setWorkouts] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchCategories();
  }, [email]);

  const fetchCategories = async () => {
    const email = localStorage.getItem('email'); // Retrieve email from localStorage
    if (!email) {
        setError('User email is missing. Please log in again.');
        return;
    }

    try {
        const response = await axios.get(`${baseURL}api/workout/workoutCategories`, {
            params: { email }  // Pass email as a query parameter
        });
        setCategories(response.data);
    } catch (error) {
        setError('Error fetching workout categories: ' + error.message);
    }
};

  useEffect(() => {
    if (email && date) {
      fetchWorkouts();
    }
  }, [email, date]);

  const fetchWorkouts = async () => {
    try {
        // Send the UTC date string (YYYY-MM-DD)
        const utcDate = date.toISOString().split('T')[0];

        const response = await axios.get(`${baseURL}api/workout/user/${email}/workouts`, {
            params: {
                date: utcDate // Send the UTC date
            }
        });

        // Set the workouts directly
        setWorkouts(response.data);
        console.log(response.data)
    } catch (error) {
        setError('Error fetching workouts: ' + error.message);
    }
};




  const fetchWorkoutsByCategory = async (categoryId) => {
      const email = localStorage.getItem('email'); // Retrieve email from localStorage
      if (!email) {
          setError('User email is missing. Please log in again.');
          return;
      }
  
      try {
        const response = await axios.get(`${baseURL}api/workout/category/${categoryId}/workouts`, {
              params: { email }
        });
      setWorkoutsByCategory(response.data);

      // Filter out duplicate workouts by comparing exercise names
      const uniqueWorkouts = response.data.reduce((acc, workout) => {
        const existingWorkout = acc.find(w => w.exercises.map(e => e.name).sort().join(', ') === workout.exercises.map(e => e.name).sort().join(', '));
        if (!existingWorkout) {
          acc.push(workout);
        }
        return acc;
      }, []);

      setWorkoutsByCategory(uniqueWorkouts);
    } catch (error) {
      setError('Error fetching workouts by category: ' + error.message);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedWorkout(null); // Reset selected workout
    if (categoryId) {
        fetchWorkoutsByCategory(categoryId); // Fetch workouts for the selected category
    } else {
        setWorkoutsByCategory([]); // Clear workouts if no category is selected
    }
};

const onCategoryCreated = () => {
  // This function should re-fetch the categories or update the state in some way
  fetchCategories();
};
const handleDeleteCategory = async (categoryId) => {
  const email = localStorage.getItem('email');
  if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
  }

  try {
      await axios.delete(`${baseURL}api/workout/category/${categoryId}`, {
          data: { email }
      });
      setError('Category deleted successfully');
      fetchCategories(); // Refresh categories after deletion
  } catch (error) {
      setError('Error deleting category: ' + (error.response?.data?.message || error.message));
  }
};


  const handleWorkoutSelect = (workoutId) => {
    const workout = workoutsByCategory.find(w => w._id === workoutId);
    setSelectedWorkout(workout);
    if (workout) {
      setExercises(workout.exercises); // Populate form with existing workout data
    }
  };

 /* const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '', restTime: '', currentRepMax: '', oneRepMax: '' }]);
  };
  */

  const handleRemoveExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = exercises.map((exercise, i) => {
      if (i === index) {
        const updatedExercise = { ...exercise, [field]: value };

        // Automatically calculate the one rep max when weight or reps change
        if (field === 'weight' || field === 'reps') {
          const weightValue = parseFloat(updatedExercise.weight);
          const repsValue = parseInt(updatedExercise.reps, 10);

          if (!isNaN(weightValue) && !isNaN(repsValue) && repsValue > 0) {
            const calculatedOneRepMax = (weightValue / (1.0278 - 0.0278 * repsValue)).toFixed(2);
            updatedExercise.oneRepMax = calculatedOneRepMax;
          } else {
            updatedExercise.oneRepMax = '';
          }
        }

        return updatedExercise;
      }
      return exercise;
    });
    setExercises(newExercises);
  };

  const handleLogWorkout = async () => {
    if (!selectedCategory) {
        setError('Please select a workout category.');
        return;
    }

    if (exercises.length === 0 || !exercises[0].name.trim()) {
        setError('Please add at least one exercise with a valid name.');
        return;
    }

    try {
        // Validate and parse the date
        const parsedDate = date ? new Date(date) : new Date();
        if (isNaN(parsedDate.getTime())) {
            setError('Invalid date selected. Please choose a valid date.');
            return;
        }

        const payload = {
            exercises,
            email,
            date: parsedDate.toISOString(),  // Include the validated date
            categoryId: selectedCategory,
        };

        if (selectedWorkout && new Date(selectedWorkout.date).toISOString() === parsedDate.toISOString()) {
            payload.workoutId = selectedWorkout._id; // Only pass the workoutId if editing the exact same workout
        }

        const response = await axios.post(`${baseURL}api/workout/logWorkout`, payload);
        setError('Workout logged successfully');
        fetchWorkoutsByCategory(selectedCategory);  // Refresh the workouts list
    } catch (error) {
        console.error("Error logging workout:", error.response?.data || error.message);
        setError('Error logging workout: ' + (error.response?.data?.message || error.message));
    }
};


  const onDateChange = (newDate) => {
    setDate(newDate);
    fetchWorkouts();
};

const filteredWorkouts = workoutsByCategory.filter(workout => {
    const workoutDate = new Date(workout.date).toDateString();
    const selectedDate = date.toDateString();
    return workoutDate === selectedDate;
});


return (
  <Box p={[4, 5]} maxW="100%" mx="auto" overflowX="hidden">
    <Heading as="h1" size="xl" mb={6} textAlign="center">
      Your Workouts for {date.toDateString()}
    </Heading>

    {error && (
      <Alert status="error" mb={4}>
        <AlertIcon />
        {error}
      </Alert>
    )}

{workouts.length > 0 ? (
  <Box as="ul" mb={6}>
    {workouts.map((workout) => {
      const workoutDate = new Date(workout.date).toLocaleDateString();
      const selectedDate = date.toLocaleDateString();

      if (workoutDate === selectedDate) {
        return (
          <Box
            as="li"
            key={workout._id}
            mb={4}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="sm"
            bg="#fff"
            transition="transform 0.3s, box-shadow 0.3s"
            _hover={{
              transform: 'scale(1.02)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Heading as="h3" size="md" mb={2}>
              Exercises:
            </Heading>
            <Box as="ul" pl={4}>
              {workout.exercises.map((exercise, index) => (
                <Text key={index} fontSize="sm">
                  {exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight} LBS, Rest Time: {exercise.restTime}s, Current Rep Max: {exercise.currentRepMax} LBS, One Rep Max: {exercise.oneRepMax} LBS
                </Text>
              ))}
            </Box>
          </Box>
        );
      }
      return null;
    })}
  </Box>
) : (
  <Text fontSize="lg" textAlign="center">
    No workouts logged for this date.
  </Text>
)}


    <Text fontSize="lg" fontWeight="semibold" mt={6} textAlign="center">
      {date.toDateString()}
    </Text>

    <Box mb={6} w="100%">
      <Calendar onChange={onDateChange} value={date} />
    </Box>

    <VStack spacing={6} w="100%">
      <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
        <CreateCategory
          onCategoryCreated={onCategoryCreated}
          categories={categories}
          handleDeleteCategory={handleDeleteCategory}
        />
      </Box>

      <Box w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
        <HorizontalScrollbar
          categories={categories}
          handleCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
          handleDeleteCategory={handleDeleteCategory}
        />
      </Box>

      {workoutsByCategory.length > 0 && (
        <Box w="100%" mb={6} p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
          <Heading as="h3" size="md" mb={2}>
            Workouts in Selected Category
          </Heading>
          <Box as="ul" pl={4}>
            {workoutsByCategory.map((workout) => (
              <Box as="li" key={workout._id} mb={4}>
                <strong>{workout.exercises.map((e) => e.name).join(', ')}</strong>
                <Button size="sm" mt={2} onClick={() => handleWorkoutSelect(workout._id)}>
                  Edit Workout
                </Button>
                <Box as="ul" pl={4}>
                  {workout.exercises.map((exercise, index) => (
                    <Text key={index} fontSize="sm">
                      {exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight} LBS,
                      Rest Time: {exercise.restTime}s, Current Rep Max: {exercise.currentRepMax} LBS, One Rep Max: {exercise.oneRepMax} LBS
                    </Text>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </VStack>

    <VStack spacing={6} w="100%">
      <Heading as="h3" size="md" my={4}>
        Exercises
      </Heading>
      {exercises.map((exercise, index) => (
        <Box key={index} w="100%" p={5} borderWidth="1px" borderRadius="md" boxShadow="md">
          <VStack spacing={4}>
            <Input
              type="text"
              placeholder="Exercise Name"
              value={exercise.name}
              onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
              w="100%"
            />
            <Input
              type="number"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
              w="100%"
            />
            <Input
              type="number"
              placeholder="Reps"
              value={exercise.reps}
              onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
              w="100%"
            />
            <Input
              type="number"
              placeholder="Weight (LBS)"
              value={exercise.weight}
              onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
              w="100%"
            />
            <Input
              type="number"
              placeholder="Rest Time (s)"
              value={exercise.restTime}
              onChange={(e) => handleExerciseChange(index, 'restTime', e.target.value)}
              w="100%"
            />
            <Input
              type="number"
              placeholder="Current Rep Max (LBS)"
              value={exercise.currentRepMax}
              onChange={(e) => handleExerciseChange(index, 'currentRepMax', e.target.value)}
              w="100%"
            />
            <Input
              type="text"
              placeholder="One Rep Max (LBS)"
              value={exercise.oneRepMax}
              readOnly
              w="100%"
            />
          </VStack>
          {exercises.length > 1 && (
            <Button mt={4} colorScheme="red" size="sm" onClick={() => handleRemoveExercise(index)} w="100%">
              Remove Exercise
            </Button>
          )}
        </Box>
      ))}
    </VStack>

    <Button colorScheme="teal" mt={4} onClick={handleLogWorkout} w="100%">
      {selectedWorkout ? 'Update Workout' : 'Log Workout'} for {date.toDateString()}
    </Button>
  </Box>
);





};

export default WorkoutLogger;
