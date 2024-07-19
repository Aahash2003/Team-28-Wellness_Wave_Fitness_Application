import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Workout.css'; // Import the CSS file for styling

const WorkoutLogger = () => {
  const email = localStorage.getItem('email'); // Local storage set in the login

  const [workoutName, setWorkoutName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [restTime, setRestTime] = useState('');
  const [currentRepMax, setCurrentRepMax] = useState('');
  const [oneRepMax, setOneRepMax] = useState('');
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    console.log('Email from local storage:', email); // Debug log
  }, [email]);

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

  const handleLogWorkout = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/workout/logWorkout', {
        workoutName,
        sets,
        reps,
        weight,
        restTime,
        currentRepMax,
        oneRepMax,
        email // Include email in the workout logging request
      });
      alert('Workout logged successfully');
      fetchWorkouts();
    } catch (error) {
      alert('Error logging workout: ' + error.message);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/workout/user/${email}/workouts`);
      setWorkouts(response.data);
    } catch (error) {
      alert('Error fetching workouts: ' + error.message);
    }
  };

  useEffect(() => {
    if (email) {
      fetchWorkouts();
    }
  }, [email]);

  return (
    <div>
      <h2>Log a New Workout</h2>
      <input
        type="text"
        placeholder="Workout Name"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Sets"
        value={sets}
        onChange={(e) => setSets(e.target.value)}
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <input
        type="number"
        placeholder="Weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <input
        type="number"
        placeholder="Rest Time"
        value={restTime}
        onChange={(e) => setRestTime(e.target.value)}
      />
      <input
        type="number"
        placeholder="Current One Rep Max"
        value={currentRepMax}
        onChange={(e) => setCurrentRepMax(e.target.value)}
      />
    
      <button onClick={handleLogWorkout}>Log Workout</button>
      

      <h2>Your Workouts</h2>
      {workouts.length > 0 ? (
        <ul className="workout-list">
          {workouts.map((workout) => (
            <li key={workout._id}>
              {workout.workoutName} - Sets: {workout.sets}, Reps: {workout.reps}, Weight: {workout.weight} LBS, Rest Time: {workout.restTime}s, Current One Rep Max: {workout.currentRepMax} LBS
            </li>
          ))}
        </ul>
      ) : (
        <p>No workouts logged yet.</p>
      )}
      <div className="one-rep-max-container">
        <input
          type="text"
          placeholder="One Rep Max"
          value={oneRepMax}
          readOnly
        />
        <span className="one-rep-max-label">LBS</span>
      </div>
    </div>
    
  );
};

export default WorkoutLogger;
