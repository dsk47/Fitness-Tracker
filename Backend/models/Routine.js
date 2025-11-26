const mongoose = require("mongoose");

const routineSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    level: String,     // Beginner/Intermediate/Advanced
    duration: Number,  // minutes
    videoUrl: String,
    approxCalories: { type: Number, default: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Routine", routineSchema);
