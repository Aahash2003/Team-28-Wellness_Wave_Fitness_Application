const mongoose = require('mongoose');

// Define the Exercise schema for individual exercises in a workout
const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    restTime: { type: Number, required: true },
    currentRepMax: { type: Number, default: false }
});

// Define the Workout schema, which can include multiple exercises
const workoutSchema = new mongoose.Schema({
    workoutName: { type: String, required: true },
    exercises: [exerciseSchema], // Array of exercises
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Define the WorkoutCategory schema to organize workouts
const workoutCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }]
});

// Define the UserWorkoutPlan schema for user-defined workout plans
const userWorkoutPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planName: { type: String, required: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutCategory' },
    workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }]
});

// Define the WorkoutLog schema for tracking user workout logs
const workoutLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
    date: { type: Date, default: Date.now, required: true },
    notes: String
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
const Workout = mongoose.model('Workout', workoutSchema);
const WorkoutCategory = mongoose.model('WorkoutCategory', workoutCategorySchema);
const UserWorkoutPlan = mongoose.model('UserWorkoutPlan', userWorkoutPlanSchema);
const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);

module.exports = { Exercise, Workout, WorkoutCategory, UserWorkoutPlan, WorkoutLog };



/* Workout List 
Takes the users email, to verify on other records
1) Chooses a Day
2) Sets the Title - Back and Biceps
3) Implements the workout - Correlates to the name of the workout - Sets - Reps - Rest Time - Weight - 1 Rep Max
4) Possibly implement a calendar to organize the dates of the workouts
5) Possibly grab the workout from the Exercise DB for a visual display(by using the search function, but that might be overkill)
6) Needs to retrieve all records from the users workout list
7) Needs to be correlated to the user 

*/