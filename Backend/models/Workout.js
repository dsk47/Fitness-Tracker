const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    type: String,
    name: String,
    duration: Number,
    calories: Number,
    steps: { type: Number, default: 0 },
    source: { type: String, default: "manual" }, // manual|guided
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
