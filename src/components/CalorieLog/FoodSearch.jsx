// src/components/FoodSearch.js
import React, { useState } from 'react';
import axios from 'axios';

const FoodSearch = () => {
  const [query, setQuery] = useState('');
  const [macros, setMacros] = useState(null);

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
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
