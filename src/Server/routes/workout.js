const express = require('express');
const { User } = require('../models/user');
const { Workout, WorkoutLog, WorkoutCategory, UserWorkoutPlan } = require('../models/workoutlist');

const router = express.Router();

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};



router.delete('/category/:categoryId/workout/:workoutId', async (req, res) => {
    const { categoryId, workoutId } = req.params;
    const { email } = req.body; // User's email for authorization

    try {
        // Find the user by email
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find the category by categoryId
        const category = await WorkoutCategory.findById(categoryId);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Ensure that the workout is part of this category
        const workoutIndex = category.workouts.indexOf(workoutId);
        if (workoutIndex === -1) {
            return res.status(404).send('Workout not found in the specified category');
        }

        // Remove the workout from the category's workouts array
        category.workouts.splice(workoutIndex, 1);
        await category.save(); // Save the updated category

        // Find and delete the workout from the Workout collection
        const workout = await Workout.findById(workoutId);
        if (!workout) {
            return res.status(404).send('Workout not found');
        }

        // Ensure the workout belongs to the user
        if (!workout.user.equals(user._id)) {
            return res.status(403).send('You are not authorized to delete this workout');
        }

        // Delete the workout
        await Workout.deleteOne({ _id: workoutId });

        // Optionally, remove the workout from the user's workouts array if needed
        user.workouts = user.workouts.filter(w => !w.equals(workoutId));
        await user.save(); // Save the updated user

        res.status(200).send('Workout deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message); // Handle any errors that occur
    }
});



router.post('/logWorkout', async (req, res) => {
    const { email, exercises, categoryId, workoutId, date } = req.body;

    try {
        // Find the user by email
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find the category by categoryId
        const category = await WorkoutCategory.findById(categoryId);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Validate and parse the date
        const parsedDate = date ? new Date(date) : new Date();
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).send('Invalid date provided');
        }

        let workout;

        if (workoutId) {
            // Update existing workout if workoutId is provided
            workout = await Workout.findById(workoutId);
            if (workout) {
                workout.exercises = exercises;
                workout.date = parsedDate;
            } else {
                return res.status(404).send('Workout not found');
            }
        } else {
            // No workoutId provided, so determine uniqueness by comparing exercise names.
            // Compute a signature for the incoming exercises:
            const incomingExerciseNames = exercises.map(e => e.name).sort().join(',');

            // Search for a workout for this user, category, and date (within the same day)
            workout = await Workout.findOne({
                user: user._id,
                category: categoryId,
                date: {
                    $gte: new Date(parsedDate).setHours(0, 0, 0, 0),
                    $lte: new Date(parsedDate).setHours(23, 59, 59, 999)
                }
            });

            if (workout) {
                // Compare the existing workout's exercise names to the incoming signature
                const existingExerciseNames = workout.exercises.map(e => e.name).sort().join(',');
                if (existingExerciseNames === incomingExerciseNames) {
                    // They match: update the existing workout
                    workout.exercises = exercises;
                    workout.date = parsedDate;
                } else {
                    // They differ: create a new workout
                    workout = new Workout({
                        exercises,
                        user: user._id,
                        category: category._id,
                        date: parsedDate
                    });
                    // Add new workout to the category and user
                    category.workouts.push(workout._id);
                    await category.save();
                    user.workouts.push(workout._id);
                    await user.save();
                }
            } else {
                // No workout exists for that day in this category: create a new one.
                workout = new Workout({
                    exercises,
                    user: user._id,
                    category: category._id,
                    date: parsedDate
                });
                category.workouts.push(workout._id);
                await category.save();
                user.workouts.push(workout._id);
                await user.save();
            }
        }

        await workout.save();
        res.status(201).send('Workout logged successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});





router.get('/user/:email/workouts', async (req, res) => {
    const { email } = req.params;
    const { date } = req.query;

    try {
        const startOfDayUTC = new Date(date);
        startOfDayUTC.setUTCHours(0, 0, 0, 0);

        const endOfDayUTC = new Date(date);
        endOfDayUTC.setUTCHours(23, 59, 59, 999);

        const user = await getUserByEmail(email);

        const workouts = await Workout.find({
            user: user._id,
            date: {
                $gte: startOfDayUTC,
                $lte: endOfDayUTC
            }
        });

        res.status(200).json(workouts);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/createCategory', async (req, res) => {
    const { name, description, imageUrl, email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newCategory = new WorkoutCategory({ 
            name, 
            description, 
            imageUrl, 
            user: user._id // Associate the category with the user
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.get('/workoutCategories', async (req, res) => {
    const { email } = req.query;

    try {
        const user = await getUserByEmail(email);

        const categories = await WorkoutCategory.find({ user: user._id });
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/category/:categoryId/workouts', async (req, res) => {
    const { categoryId } = req.params;
    const { email } = req.query;

    try {
        const user = await getUserByEmail(email);

        const workouts = await Workout.find({ category: categoryId, user: user._id });
        res.status(200).json(workouts);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/addToCategory', async (req, res) => {
    const { email, categoryId } = req.body;
    try {
        // Find the user by email
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        // Find the category by ID
        const category = await WorkoutCategory.findById(categoryId);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        
        // Create a new workout with an empty exercises array.
        // The date will default to Date.now (as per your Workout schema) if not provided.
        const workout = new Workout({
            exercises: [],
            user: user._id,
            category: category._id
        });
        await workout.save();
        
        // Add the workout to the category's workouts array
        category.workouts.push(workout._id);
        await category.save();
        
        // Optionally, add the workout to the user's workouts array if needed.
        user.workouts.push(workout._id);
        await user.save();
        
        res.status(201).json(workout);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


router.delete('/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    const { email } = req.body; // Assuming the email is sent in the request body

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find the category to delete
        const category = await WorkoutCategory.findOne({ _id: categoryId, user: user._id });
        if (!category) {
            return res.status(404).send('Category not found or does not belong to the user');
        }

        // Delete the category
        await WorkoutCategory.deleteOne({ _id: categoryId, user: user._id });

        res.status(200).send('Category deleted successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});


module.exports = router;
