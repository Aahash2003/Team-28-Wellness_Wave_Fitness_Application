require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const workoutRoutes = require("./routes/workout")
const caloriesRoutes = require("./routes/calorie")
const calcRoutes = require("./routes/caloriecalc")
const profileRoutes = require("./routes/profile")


// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/workout", workoutRoutes)
app.use("/api/calories", caloriesRoutes)
app.use("/api/calc", calcRoutes)
app.use("/api/profile", profileRoutes)

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}...`));
