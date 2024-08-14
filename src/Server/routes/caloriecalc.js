const express = require('express');
const Profile = require('../models/profile');
const CaloricValue = require('../models/CaloricValue'); // Corrected the import case
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

function calculateMacroGrams(dailyCalories, fatPercentage, proteinPercentage, carbPercentage) {
    const fatCalories = (dailyCalories * (fatPercentage / 100));
    const proteinCalories = (dailyCalories * (proteinPercentage / 100));
    const carbCalories = (dailyCalories * (carbPercentage / 100));

    const fatGrams = fatCalories / 9;
    const proteinGrams = proteinCalories / 4;
    const carbGrams = carbCalories / 4;

    return { fatGrams, proteinGrams, carbGrams };
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
        
        console.log("Days" + durationInDays);
        const dailyCalories = calculateDailyCalories(calorie_Maintenance, parseFloat(targetWeight), profile.CurrentWeight, durationInDays);
        
        console.log(`Daily Calories calculated: ${dailyCalories}`);
        
        res.json({ dailyCalories, calorie_Maintenance });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/store-caloric-value', async (req, res) => {
    try {
        const { email, caloricMaintenance, dailyCalories } = req.body;

        if (!email || (!caloricMaintenance && !dailyCalories)) {
            return res.status(400).json({ msg: 'Please provide email and at least one caloric value.' });
        }

        const caloricValue = new CaloricValue({
            email,
            caloricMaintenance: caloricMaintenance ? parseFloat(caloricMaintenance) : null,
            dailyCalories: dailyCalories ? parseFloat(dailyCalories) : null,
        });

        await caloricValue.save();
        console.log({ msg: 'Caloric value stored successfully', caloricValue });
        res.json({ msg: 'Caloric value stored successfully', caloricValue });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Route to calculate macronutrient grams based on stored caloric value
router.get('/calculate-macros/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { fat, protein, carbohydrates, type } = req.query;

        if (!fat || !protein || !carbohydrates || !type) {
            return res.status(400).json({ msg: 'Please provide all macronutrient percentages and type.' });
        }

        const totalPercentage = parseFloat(fat) + parseFloat(protein) + parseFloat(carbohydrates);
        if (totalPercentage !== 100) {
            return res.status(400).json({ msg: 'Macronutrient percentages must sum to 100%.' });
        }

        const caloricValue = await CaloricValue.findOne({ email });
        if (!caloricValue) {
            return res.status(404).json({ msg: 'Caloric value not found. Please calculate it first.' });
        }

        let dailyCalories;
        if (type === 'maintenance') {
            dailyCalories = caloricValue.caloricMaintenance;
        } else if (type === 'daily') {
            dailyCalories = caloricValue.dailyCalories;
        } else {
            return res.status(400).json({ msg: 'Invalid type provided. Use "maintenance" or "daily".' });
        }

        if (!caloricValue) {
            return res.status(400).json({ msg: `${type} calories not found. Please calculate and store the values first.` });
        }

        const { fatGrams, proteinGrams, carbGrams } = calculateMacroGrams(dailyCalories, parseFloat(fat), parseFloat(protein), parseFloat(carbohydrates));

        res.json({ fatGrams, proteinGrams, carbGrams });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
