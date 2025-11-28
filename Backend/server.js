// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const errorHandler = require("./middleware/errorHandler");
const Routine = require("./models/Routine");

const app = express();

// --- SEED FUNCTION ---
async function seedRoutinesIfEmpty() {
  try {
    const count = await Routine.countDocuments();
    if (count > 0) {
      console.log(`Routines already exist (${count} docs), skipping seed`);
      return;
    }

    await Routine.insertMany([
      {
        title: "Morning Yoga Flow",
        description: "15-min stretching for beginners",
        level: "Beginner",
        duration: 15,
        videoUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
        approxCalories: 80,
      },
      {
        title: "Fat Burn HIIT",
        description: "20-min high-intensity fat burn workout",
        level: "Intermediate",
        duration: 20,
        videoUrl: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
        approxCalories: 220,
      },
      {
        title: "Full Body Strength",
        description: "30-min dumbbell strength routine",
        level: "Intermediate",
        duration: 30,
        videoUrl: "https://www.youtube.com/watch?v=UBMk30rjy0o",
        approxCalories: 250,
      },
    ]);

    console.log("Default guided routines seeded");
  } catch (err) {
    console.error("Error seeding routines:", err.message);
  }
}

// 👉 CONNECT + SEED
connectDB()
  .then(seedRoutinesIfEmpty)
  .catch((err) => console.error("DB init error:", err));

// --- MIDDLEWARE & ROUTES ---
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/workouts", require("./routes/workoutRoutes"));
app.use("/api/metrics", require("./routes/metricsRoutes"));
app.use("/api/meals", require("./routes/dietRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/guided", require("./routes/guidedRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));
app.use("/api/sync", require("./routes/syncRoutes"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
