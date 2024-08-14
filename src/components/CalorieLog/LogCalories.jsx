import React, { useState } from 'react';
import axios from 'axios';

const LogCalories = ({ selectedDate, onLogSuccess }) => {
  const email = localStorage.getItem('email');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbohydrates, setCarbohydrates] = useState('');
  const [fats, setFats] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/calories/logcalories', {
        email,
        date: selectedDate.toISOString().split('T')[0], // Log calories for the selected date
        calories,
        protein,
        carbohydrates,
        fats,
      });
      alert(response.data);
      setCalories(''); // Clear the form fields
      setProtein('');
      setCarbohydrates('');
      setFats('');
      onLogSuccess(); 
    } catch (error) {
      console.error(error);
      alert('Error logging calories');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log Calories</h2>
      <p>Logging calories for {new Date().toDateString()}</p>

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
