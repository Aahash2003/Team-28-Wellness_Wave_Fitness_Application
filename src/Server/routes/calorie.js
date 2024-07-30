const express = require('express');
const { User } = require('../models/user');
const Workout = require('../models/calorielog');

const router = express.Router();

// Log a new workout
router.post('/logcalories', async (req, res) => {
    const { email, calories, protein, carbohydrates, fats } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newlog = new Workout({
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

// Get workouts for a specific user
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

module.exports = router;
