const express = require('express');
const { User } = require('../models/user');
const Workout = require('../models/workoutlist');

const router = express.Router();

// Log a new workout
router.post('/logWorkout', async (req, res) => {
    const { email, workoutName, sets, reps, weight, restTime, currentRepMax, possibleRepMax } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newWorkout = new Workout({
            workoutName,
            sets,
            reps,
            weight,
            restTime,
            currentRepMax,
            possibleRepMax,
            user: user._id
        });

        await newWorkout.save();
        user.workouts.push(newWorkout._id);
        await user.save();

        res.status(201).send('Workout logged');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get workouts for a specific user
router.get('/user/:email/workouts', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email }).populate('workouts');
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user.workouts);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
