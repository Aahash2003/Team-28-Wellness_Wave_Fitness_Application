import React, { useState } from 'react';
import axios from 'axios';

const FoodSearch = ({ selectedDate, onFoodSuccess }) => {
  const [query, setQuery] = useState('');
  const [macros, setMacros] = useState(null);
  const email = localStorage.getItem('email');

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8080/api/calories/macros?query=${query}`);
      setMacros(response.data);
    } catch (error) {
      console.error(error);
      alert('Error fetching macro information');
    }
  };

  const handleLogFood = async () => {
    if (macros) {
      // Convert the selected date to UTC before logging
      const localDate = new Date(selectedDate);
      const utcDate = new Date(Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      ));

      try {
        const response = await axios.post('http://localhost:8080/api/calories/macros/log', {
          email,
          date: utcDate.toISOString(), // Send the date in UTC format
          item: macros.item,
          calories: macros.calories,
          protein: macros.proteins,
          carbohydrates: macros.carbohydrates,
          fats: macros.fats
        });
        alert('Food item logged successfully');
        onFoodSuccess();
        setMacros(null); // Clear the macros after logging
        setQuery(''); // Clear the query after logging
      } catch (error) {
        console.error(error);
        alert('Error logging food item');
      }
    }
  };

  return (
    <div>
      <h2>Food Search</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search food"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
      {macros && (
        <div>
          <h3>{macros.item}</h3>
          <p>Carbohydrates: {macros.carbohydrates} g</p>
          <p>Fats: {macros.fats} g</p>
          <p>Proteins: {macros.proteins} g</p>
          <p>Calories: {macros.calories} kcal</p>
          <button onClick={handleLogFood}>Log Food to Calorie Log for {selectedDate.toDateString()}</button>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
