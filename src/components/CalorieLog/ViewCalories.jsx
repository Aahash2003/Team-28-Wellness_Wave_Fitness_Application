// src/components/CalorieLog/ViewCalories.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewCalories.css';
import { features } from 'process';

const ViewCalories = ({onDeleteSuccess }) => {
  const email = localStorage.getItem('email');
  const [calories, setCalories] = useState([]); // Storing the data from the Get Function

  const fetchCalories = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/calories/user/${email}/calories`);
      setCalories(response.data);
    } catch (error) {
      console.error('Error fetching calorie data:', error);
      alert('Error fetching calorie data');
    }
  };

  // useEffect to fetch calorie logs when the component mounts
  useEffect(() => {
    if (email) {
      fetchCalories();
    }
  }, [email]);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/calories/logcalories/${id}`);
      alert('Calorie log deleted');
      fetchCalories(); // Refresh logs after deletion
      onDeleteSuccess();
    } catch (error) {
      console.error(error);
      alert('Error deleting calorie log');
    }
  };

  return (
    <div className="container">
      <h2>View Calories</h2>
      <ul>
        {calories.map((log) => (// Maps the Data to the UI but from the specific data log information
          <li key={log._id}>
            <span className="log-item">{log.calories} kcal</span>
            <span className="log-item">{log.protein} g protein</span>
            <span className="log-item">{log.carbohydrates} g carbs</span>
            <span className="log-item">{log.fats} g fats</span>
            <button onClick={() => handleDelete(log._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );

}
export default ViewCalories;
