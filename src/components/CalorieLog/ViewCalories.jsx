import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './ViewCalories.css';

const ViewCalories = ({ calories, onDeleteSuccess }) => {
  const email = localStorage.getItem('email');

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/calories/logcalories/${id}`);
      alert('Calorie log deleted');
      onDeleteSuccess(); // Trigger the parent to refresh the logs
    } catch (error) {
      console.error('Error deleting calorie log:', error);
      alert('Error deleting calorie log');
    }
  };

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
            <button onClick={() => handleDelete(log._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Define PropTypes for the component to ensure correct prop usage
ViewCalories.propTypes = {
  calories: PropTypes.array.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};

export default ViewCalories;
