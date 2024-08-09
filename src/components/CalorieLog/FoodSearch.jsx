import React, { useState } from 'react';
import axios from 'axios';

const FoodSearch = ({onFoodSuccess}) => {
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
      try {
        const response = await axios.post('http://localhost:8080/api/calories/macros/log', {
          email,
          item: macros.item,
          calories: macros.calories,
          protein: macros.proteins,
          carbohydrates: macros.carbohydrates,
          fats: macros.fats
        });
        alert('Food item logged successfully');
        onFoodSuccess();
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
          <button onClick={handleLogFood}>Log Food to Calorie Log</button>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
