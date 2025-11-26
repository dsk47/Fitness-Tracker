const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    caloriesPer100g: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
