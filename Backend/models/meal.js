const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    mealType: String,
    foodName: String,
    calories: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meal", mealSchema);
