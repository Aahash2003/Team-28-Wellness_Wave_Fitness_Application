const mongoose = require('mongoose');

// Define the Workout schema
const workoutSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now, required: true },
    workoutName: { type: String, required: true },
    sets: { type: String, required: true },
    reps: { type: String, required: true },
    weight: { type: String, required: true },
    restTime: { type: String, required: true },
    currentRepMax: { type: String, default: false },
    possibleRepMax: { type: String, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;



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