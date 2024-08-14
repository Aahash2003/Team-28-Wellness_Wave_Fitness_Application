const express = require('express');
const Profile = require('../models/profile');
const router = express.Router();
const dayjs = require('dayjs'); // Import dayjs for date calculations
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

function calculateTDEE(age, gender, height, weight, activityLevel) {
    let BMR;
    if (gender === 'Male') {
        BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let multiplier;

    if (activityLevel === 'Sedentary') {
        multiplier = 1.2;
    } else if (activityLevel === 'Lightly Active') {
        multiplier = 1.375;
    } else if (activityLevel === 'Moderately Active') {
        multiplier = 1.55;
    } else if (activityLevel === 'Very Active') {
        multiplier = 1.725;
    } else if (activityLevel === 'Super Active') {
        multiplier = 1.9;
    } else {
        throw new Error(`Invalid activity level: ${activityLevel}`);
    }

    return BMR * multiplier;
}

function calculateDailyCalories(calorie_Maintenance, targetWeight, currentWeight, durationInDays) {
    const weightDifference = targetWeight - currentWeight;
    const totalCaloriesChange = weightDifference * 7700; // 1 kg = 7700 calories
    const dailyCaloricAdjustment = totalCaloriesChange / durationInDays;

    return calorie_Maintenance + dailyCaloricAdjustment;
}

// Route to calculate TDEE by email
router.get('/calculate/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const profile = await Profile.findOne({ email });
        if (!profile) {
            return res.status(404).json({ msg: 'User profile not found. Please create your profile first.' });
        }

        // Calculate age based on DOB
        const calculateAge = (DOB) => {
            return dayjs().diff(dayjs(DOB), 'year');
        };

        const age = calculateAge(profile.DOB);
        
        // Log the values for debugging
        console.log(`Calculating TDEE for: age=${age}, gender=${profile.Gender}, height=${profile.Height}, weight=${profile.CurrentWeight}, activityLevel=${profile.ActivityLevel}`);
        
        const calorie_Maintenance = calculateTDEE(age, profile.Gender, profile.Height, profile.CurrentWeight, profile.ActivityLevel);
        
        console.log(`Calorie Maintenance: ${calorie_Maintenance}`);
        
        res.json({ calorie_Maintenance });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to calculate daily calories based on goal by email
router.get('/calculate-DC/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { targetWeight, startDate, endDate } = req.query;

        if (!targetWeight || !startDate || !endDate) {
            return res.status(400).json({ msg: 'Please provide target weight, start date, and end date.' });
        }

        const profile = await Profile.findOne({ email });
        if (!profile) {
            return res.status(404).json({ msg: 'User profile not found. Please create your profile first.' });
        }

        // Calculate age based on DOB
        const calculateAge = (DOB) => {
            return dayjs().diff(dayjs(DOB), 'year');
        };

        const age = calculateAge(profile.DOB);
        
        // Log the values for debugging
        console.log(`Calculating TDEE for: age=${age}, gender=${profile.Gender}, height=${profile.Height}, weight=${profile.CurrentWeight}, activityLevel=${profile.ActivityLevel}`);
        
        const calorie_Maintenance = calculateTDEE(age, profile.Gender, profile.Height, profile.CurrentWeight, profile.ActivityLevel);
        
        console.log(`TDEE calculated: ${calorie_Maintenance}`);
        
        // Parse startDate and endDate using dayjs
        const parsedStartDate = dayjs(startDate, ['YYYY-MM-DD', 'MM/DD/YYYY']);
        const parsedEndDate = dayjs(endDate, ['YYYY-MM-DD', 'MM/DD/YYYY']);

        const durationInDays = parsedEndDate.diff(parsedStartDate, 'day');

        if (durationInDays <= 0) {
            return res.status(400).json({ msg: 'End date must be after start date.' });
        }
        
        console.log("Days" + durationInDays)
        const dailyCalories = calculateDailyCalories(calorie_Maintenance, parseFloat(targetWeight), profile.CurrentWeight, durationInDays);
        
        console.log(`Daily Calories calculated: ${dailyCalories}`);
        
        res.json({ dailyCalories, calorie_Maintenance });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
