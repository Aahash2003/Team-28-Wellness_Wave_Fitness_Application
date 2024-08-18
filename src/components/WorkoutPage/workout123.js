import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Workout.css'; // Import the CSS file for styling

const WorkoutLogger = () => {
  const email = localStorage.getItem('email'); // Local storage set in the login

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '', weight: '', restTime: '', currentRepMax: '' }
  ]);
  const [workouts, setWorkouts] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Calculate One Rep Max whenever weight or reps changes
    const weightValue = parseFloat(weight);
    const repsValue = parseInt(reps, 10);

    if (!isNaN(weightValue) && !isNaN(repsValue) && repsValue > 0) {
      const calculatedOneRepMax = (weightValue / (1.0278 - 0.0278 * repsValue)).toFixed(2);
      setOneRepMax(calculatedOneRepMax);
    } else {
      setOneRepMax('');
    }
  }, [weight, reps]);
  useEffect(() => {
    console.log('Email from local storage:', email); // Debug log
    fetchCategories();
  }, [email]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/workout/workoutCategories');
      setCategories(response.data);
    } catch (error) {
      alert('Error fetching workout categories: ' + error.message);
    }
  };

  useEffect(() => {
    if (email) {
      fetchWorkouts();
    }
  }, [email]);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/workout/user/${email}/workouts`);
      setWorkouts(response.data);
    } catch (error) {
      alert('Error fetching workouts: ' + error.message);
    }
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weight: '', restTime: '', currentRepMax: '' }]);
  };

  const handleRemoveExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = exercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setExercises(newExercises);
  };

  const handleLogWorkout = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/workout/logWorkout', {
        workoutName,
        exercises,
        email,
        date,
        category: selectedCategory,
      });
      alert('Workout logged successfully');
      fetchWorkouts();
    } catch (error) {
      alert('Error logging workout: ' + error.message);
    }
  };

  const onDateChange = (date) => {
    setDate(date);
  };

  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date).toDateString();
    const selectedDate = date.toDateString();
    return workoutDate === selectedDate;
  });

  return (
    <div className="container">
      <h2>{date.toDateString()}</h2>
      <Calendar onChange={onDateChange} value={date} />
      
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
      />

      <h3>Exercises</h3>
      {exercises.map((exercise, index) => (
        <div key={index} className="exercise-container">
          <input
            type="text"
            placeholder="Exercise Name"
            value={exercise.name}
            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
          />
          <input
            type="number"
            placeholder="Sets"
            value={exercise.sets}
            onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
          />
          <input
            type="number"
            placeholder="Reps"
            value={exercise.reps}
            onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
          />
          <input
            type="number"
            placeholder="Weight"
            value={exercise.weight}
            onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
          />
          <input
            type="number"
            placeholder="Rest Time"
            value={exercise.restTime}
            onChange={(e) => handleExerciseChange(index, 'restTime', e.target.value)}
          />
          <input
            type="number"
            placeholder="Current Rep Max"
            value={exercise.currentRepMax}
            onChange={(e) => handleExerciseChange(index, 'currentRepMax', e.target.value)}
          />
          <div className="one-rep-max-container">
        <input
          type="text"
          placeholder="One Rep Max"
          value={oneRepMax}
          readOnly
        />
        <span className="one-rep-max-label">LBS</span>
      </div>
          {exercises.length > 1 && (
            <button onClick={() => handleRemoveExercise(index)}>Remove Exercise</button>
          )}
        </div>
      ))}
      
      <h2></h2>
      <button onClick={handleLogWorkout}>Log Workout</button>
<h2></h2>
      <button onClick={handleAddExercise}>Add Exercise</button>

      <h2>Your Workouts for {date.toDateString()}</h2>
      {filteredWorkouts.length > 0 ? (
        <ul className="workout-list">
          {filteredWorkouts.map((workout) => (
            <li key={workout._id}>
              <strong>{workout.workoutName}</strong>
              <ul>
                {workout.exercises.map((exercise, index) => (
                  <li key={index}>
                    {exercise.name} - Sets: {exercise.sets}, Reps: {exercise.reps}, Weight: {exercise.weight} LBS, Rest Time: {exercise.restTime}s, Current Rep Max: {exercise.currentRepMax} LBS, One Rep Max: {workout.oneRepMax} LBS
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No workouts logged for this date.</p>
      )}
    </div>
  );
};

export default WorkoutLogger;
