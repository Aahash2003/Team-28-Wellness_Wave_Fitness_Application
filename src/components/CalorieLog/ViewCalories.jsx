// src/components/CalorieLog/ViewCalories.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewCalories.css';

const ViewCalories = () => {
  const email = localStorage.getItem('email');
  const [calories, setCalories] = useState([]);

  useEffect(() => {
    if (email) {
      const fetchCalories = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/calories/user/${email}/calories`);
          setCalories(response.data);
        } catch (error) {
          console.error(error);
          alert('Error fetching calorie data');
        }
      };
      fetchCalories();
    }
  }, [email]);

  return (
    <div className="container">
      <h2>View Calories</h2>
      <ul>
        {calories.map((log) => (
          <li key={log._id}>
            <span className="log-item">{log.calories} kcal</span>
            <span className="log-item">{log.protein} g protein</span>
            <span className="log-item">{log.carbohydrates} g carbs</span>
            <span className="log-item">{log.fats} g fats</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewCalories;
