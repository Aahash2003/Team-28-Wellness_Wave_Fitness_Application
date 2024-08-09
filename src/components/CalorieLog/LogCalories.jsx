// src/components/LogCalories.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fetchCalories from './ViewCalories'

const LogCalories = ({onLogSuccess }) => {
  const email = localStorage.getItem('email');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbohydrates, setCarbohydrates] = useState('');
  const [fats, setFats] = useState('');

  useEffect(() => {
    console.log('Email from local storage:', email); // Debug log
  }, [email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/calories/logcalories', {
        email,
        calories,
        protein,
        carbohydrates,
        fats,
      });
      alert(response.data);
      onLogSuccess(); 
    } catch (error) {
      console.error(error);
      alert('Error logging calories');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log Calories</h2>
      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Protein"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Carbohydrates"
        value={carbohydrates}
        onChange={(e) => setCarbohydrates(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Fats"
        value={fats}
        onChange={(e) => setFats(e.target.value)}
        required
      />
      <button type="submit">Log</button>
    </form>
  );
};

export default LogCalories;
