const express = require('express');
const { User } = require('../models/user');
const { Workout, WorkoutLog, WorkoutCategory, UserWorkoutPlan } = require('../models/workoutlist');

const router = express.Router();

router.post('/logWorkout', async (req, res) => {
    const { email, exercises, categoryId, workoutId } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find the category to ensure it exists
        const category = await WorkoutCategory.findById(categoryId);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        let workout;
        if (workoutId) {
            // Update existing workout
            workout = await Workout.findById(workoutId);
            if (workout) {
                workout.exercises = exercises;
                workout.date = Date.now(); // Update the date to the current time
            } else {
                return res.status(404).send('Workout not found');
            }
        } else {
            // Check if a workout with the same exercises already exists in the category
            workout = await Workout.findOne({ user: user._id, category: categoryId, exercises });

            if (!workout) {
                // Create a new workout if no existing workout matches
                workout = new Workout({
                    exercises,
                    user: user._id,
                    category: category._id
                });

                // Add the new workout to the category
                category.workouts.push(workout._id);
            } else {
                // Update the existing workout's date
                workout.date = Date.now(); // Update the date to the current time
            }
        }

        await workout.save();
        await category.save();
        user.workouts.push(workout._id);
        await user.save();

        res.status(201).send('Workout logged successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.get('/user/:email/workouts', async (req, res) => {
    const { email } = req.params;
    const { date } = req.query;

    try {
        // Convert the provided date to the start and end of the day in UTC
        const startOfDayUTC = new Date(date);
        startOfDayUTC.setUTCHours(0, 0, 0, 0);  // Start of UTC day
        
        const endOfDayUTC = new Date(date);
        endOfDayUTC.setUTCHours(23, 59, 59, 999);  // End of UTC day

        const user = await User.findOne({ email }).populate({
            path: 'workouts',
            match: {
                date: {
                    $gte: startOfDayUTC,
                    $lte: endOfDayUTC
                }
            }
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user.workouts);
    } catch (error) {
        res.status(400).send(error.message);
    }
});




router.post('/createCategory', async (req, res) => {
    const { name, description } = req.body;

    try {
        const newCategory = new WorkoutCategory({ name, description });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/*// Create a new user workout plan
router.post('/createWorkoutPlan', async (req, res) => {
    const { email, planName, description, category, workouts } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newWorkoutPlan = new UserWorkoutPlan({
            user: user._id,
            planName,
            description,
            category,
            workouts
        });

        await newWorkoutPlan.save();

        res.status(201).json(newWorkoutPlan);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
*/
// Get all workout categories
router.get('/workoutCategories', async (req, res) => {
    try {
        const categories = await WorkoutCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/category/:categoryId/workouts', async (req, res) => {
    const { categoryId } = req.params;

    try {
        const workouts = await Workout.find({ category: categoryId });
        res.status(200).json(workouts);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
