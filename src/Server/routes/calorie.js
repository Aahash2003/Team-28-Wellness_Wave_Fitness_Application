const express = require('express');
const { User } = require('../models/user');
const CalorieData = require('../models/calorielog');
const calorie_Maintenance = require('../models/CaloricValue')
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const router = express.Router();

const envPath = path.resolve(__dirname,'../utils/.env');
console.log("dotenv")
dotenv.config({ path: envPath });
// Log a new CalorieData



router.post('/logcalories', async (req, res) => {
    const { email, calories, protein, carbohydrates, fats } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newlog = new CalorieData({
            calories,
            protein,
            carbohydrates,
            fats,
            user: user._id
        });
        
        await newlog.save();
        user.calories.push(newlog._id);
        await user.save();

        res.status(201).send('Calories logged');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/user/:email/calories', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email }).populate('calories');
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user.calories);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
router.delete('/logcalories/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const log = await CalorieData.findById(id);
      if (!log) {
          return res.status(404).send('Calorie log not found');
      }

      // Find the associated user
      const user = await User.findById(log.user);
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Remove the log ID from the user's calories array
      user.calories = user.calories.filter(logId => logId.toString() !== id);

      // Save the user after removing the reference
      await user.save();

      // Delete the calorie log
      await CalorieData.deleteOne({ _id: id });

      res.status(200).send('Calorie log deleted successfully');
  } catch (error) {
      res.status(400).send(error.message);
  }
});

router.get('/macros', async (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
  
    try {
      // Log the start of the request
      console.log(`Received request for item: ${query}`);
  
      // Search for the food item
      const searchResponse = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${process.env.USDA_API_KEY}`
      );
  
      // Log the search response
      console.log('Search response:', searchResponse.data);
  
      if (searchResponse.data.foods.length === 0) {
        return res.status(404).json({ error: 'No food item found' });
      }
  
      // Get the food ID of the first search result
      const foodId = searchResponse.data.foods[0].fdcId;
  
      // Get detailed information about the food item
      const foodResponse = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/food/${foodId}?api_key=${process.env.USDA_API_KEY}`
      );
  
      // Log the food response
      console.log('Food response:', foodResponse.data);
  
      const nutrients = foodResponse.data.foodNutrients;
  
      // Extract macronutrients and calories
      const macros = {
        item: foodResponse.data.description,
        carbohydrates: nutrients.find(nutrient => nutrient.nutrient.name === 'Carbohydrate, by difference')?.amount || 0,
        fats: nutrients.find(nutrient => nutrient.nutrient.name === 'Total lipid (fat)')?.amount || 0,
        proteins: nutrients.find(nutrient => nutrient.nutrient.name === 'Protein')?.amount || 0,
        calories: nutrients.find(nutrient => nutrient.nutrient.name === 'Energy')?.amount || 0,
      };
  
      res.json(macros);
    } catch (error) {
      // Log the error
      console.error('Error occurred:', error);
  
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request data:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
  
      res.status(500).json({ error: 'An error occurred while fetching macro information' });
    }
  });
  // Log a searched food item directly to the user's calorie log
router.post('/macros/log', async (req, res) => {
  const { email, item, calories, protein, carbohydrates, fats } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).send('User not found');
      }

      const newlog = new CalorieData({
          item, // Name of the food item
          calories,
          protein,
          carbohydrates,
          fats,
          user: user._id
      });

      await newlog.save();
      user.calories.push(newlog._id);
      await user.save();

      res.status(201).send('Food item logged successfully');
  } catch (error) {
      res.status(400).send(error.message);
  }
});

router.get('/user/:email/remaining-calories', async (req, res) => {
  const { email } = req.params;

  try {
      const user = await User.findOne({ email }).populate('CaloricValue');
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Fetch the stored daily caloric intake
      const caloricValue = await calorie_Maintenance.findOne({ email });
      if (!caloricValue || caloricValue.dailyCalories == null || caloricValue.caloricMaintenance == null) {
          return res.status(404).json({ msg: 'Daily caloric intake not found. Please store the daily caloric value first.' });
      }

      // Calculate total logged calories and macros
      const totalLoggedCalories = user.calories.reduce((total, log) => total + log.calories, 0);
      const totalLoggedProtein = user.calories.reduce((total, log) => total + log.protein, 0);
      const totalLoggedCarbs = user.calories.reduce((total, log) => total + log.carbohydrates, 0);
      const totalLoggedFats = user.calories.reduce((total, log) => total + log.fats, 0);

      // Calculate remaining calories and macros
      const remainingCalories = caloricValue.caloricDaily - totalLoggedCalories;
      const remainingProtein = caloricValue.proteinGrams - totalLoggedProtein;
      const remainingCarbs = caloricValue.carbGrams - totalLoggedCarbs;
      const remainingFats = caloricValue.fatGrams - totalLoggedFats;

      res.status(200).json({
          remainingCalories: remainingCalories > 0 ? remainingCalories : 0,
          remainingProtein: remainingProtein > 0 ? remainingProtein : 0,
          remainingCarbs: remainingCarbs > 0 ? remainingCarbs : 0,
          remainingFats: remainingFats > 0 ? remainingFats : 0
      });
  } catch (error) {
      res.status(400).send(error.message);
  }
});


module.exports = router;
