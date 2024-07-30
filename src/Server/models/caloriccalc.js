const mongoose = require('mongoose');

// Define the Calc schema
const calcSchema = new mongoose.Schema({
    Age: {type: Number, required: true},
    Height: {type: Number, required: true},
    CurrentWeight: {type: Number, required: true},
    TargetWeight: {type: Number, required: true},
    StartDate: {type: Date, default: Date.now, required: true},
    EndDate: { type: Date, required: true },
    


});

const Calc = mongoose.model('Calorie Calculator', calcSchema);

module.exports = Calc;


//(Current Weight, Height, Age, Start Date, End Date)/ Store the Information, Target Weight
// Create two separate pages for Calculation and Calorie Log, take the Chosen Calorie Calculation store it and use it for the daily goal for calories
// Based on the Above information (Calorie Maintenance to reach goal, then the user selects the Fat, Protein, Carbohydrates Percentage for each)
// Create Three Drop Down Percentages for Fat, Protein, Carbohydrates, They must combine to 100% allow the user to designate the percentage and store the percentage of each to be shown in calorie log for target