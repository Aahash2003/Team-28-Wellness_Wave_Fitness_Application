const express = require('express');
const { User } = require('../models/user');
const { Workout, WorkoutLog, WorkoutCategory, UserWorkoutPlan } = require('../models/workoutlist');

const router = express.Router();

router.post('/logWorkout', async (req, res) => {
    const { email, exercises, categoryId } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const category = await WorkoutCategory.findById(categoryId);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Create a new workout instance with the category
        const newWorkout = new Workout({
            exercises, // Array of exercise objects
            user: user._id,
            category: category._id
        });
        
        await newWorkout.save();

        // Add the workout to the category's workouts array
        category.workouts.push(newWorkout._id);
        await category.save();

        // Assuming the User model has a workouts field to store workout references
        user.workouts.push(newWorkout._id);
        await user.save();

        res.status(201).send('Workout logged');
    } catch (error) {
        res.status(400).send(error.message);
    }
});



// Get all workouts for a specific user
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
