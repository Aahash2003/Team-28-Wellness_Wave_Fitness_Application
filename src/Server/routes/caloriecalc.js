const express = require('express');
const Profile = require('../models/profile');
const router = express.Router();

function calculateTDEE(age, gender, height, weight, activityLevel) {
    let BMR;
    if (gender === 'Male') {
        BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultiplier = {
        Sedentary: 1.2,
        LightlyActive: 1.375,
        ModeratelyActive: 1.55,
        VeryActive: 1.725,
        SuperActive: 1.9
    };

    return BMR * activityMultiplier[activityLevel];
}

function calculateDailyCalories(tdee, targetWeight, currentWeight, durationInDays) {
    const weightDifference = targetWeight - currentWeight;
    const totalCaloriesChange = weightDifference * 7700; // 1 kg = 7700 calories
    const dailyCaloricAdjustment = totalCaloriesChange / durationInDays;

    return tdee + dailyCaloricAdjustment;
}

// Route to calculate TDEE by email
router.get('/calculate-tdee/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const profile = await Profile.findOne({ email });
        if (!profile) {
            return res.status(404).json({ msg: 'User profile not found. Please create your profile first.' });
        }

        const tdee = calculateTDEE(profile.Age, profile.Gender, profile.Height, profile.CurrentWeight, profile.ActivityLevel);
        res.json({ tdee });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to calculate daily calories based on goal by email
router.get('/calculate-daily-calories/:email', async (req, res) => {
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

        const tdee = calculateTDEE(profile.Age, profile.Gender, profile.Height, profile.CurrentWeight, profile.ActivityLevel);
        const durationInDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

        if (durationInDays <= 0) {
            return res.status(400).json({ msg: 'End date must be after start date.' });
        }

        const dailyCalories = calculateDailyCalories(tdee, parseFloat(targetWeight), profile.CurrentWeight, durationInDays);
        res.json({ dailyCalories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
