import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkoutLogger = ({ token }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [restTime, setRestTime] = useState('');
  const [currentRepMax, setCurrentRepMax] = useState('');
  const [possibleRepMax, setPossibleRepMax] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const handleLogWorkout = async () => {
    try {
      const response = await axios.post('/logWorkout', {
        workoutName,
        sets,
        reps,
        weight,
        restTime,
        currentRepMax,
        possibleRepMax
      }, {
        headers: {
          'Authorization': token
        }
      });
      alert('Workout logged successfully');
      fetchWorkouts();
    } catch (error) {
      alert('Error logging workout: ' + error.message);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/user/workouts', {
        headers: {
          'Authorization': token
        }
      });
      setWorkouts(response.data);
    } catch (error) {
      alert('Error fetching workouts: ' + error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWorkouts();
    }
  }, [token]);

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
        placeholder="Current Rep Max"
        value={currentRepMax}
        onChange={(e) => setCurrentRepMax(e.target.value)}
      />
      <input
        type="number"
        placeholder="Possible Rep Max"
        value={possibleRepMax}
        onChange={(e) => setPossibleRepMax(e.target.value)}
      />
      <button onClick={handleLogWorkout}>Log Workout</button>

      <h2>Your Workouts</h2>
      {workouts.length > 0 ? (
        <ul>
          {workouts.map((workout) => (
            <li key={workout._id}>
              {workout.workoutName} - Sets: {workout.sets}, Reps: {workout.reps}, Weight: {workout.weight}, Rest Time: {workout.restTime}s, Current Rep Max: {workout.currentRepMax}, Possible Rep Max: {workout.possibleRepMax}
            </li>
          ))}
        </ul>
      ) : (
        <p>No workouts logged yet.</p>
      )}
    </div>
  );
};

export default WorkoutLogger;
