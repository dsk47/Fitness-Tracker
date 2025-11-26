const mongoose = require("mongoose");

const bodyMetricSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    weight: Number,
    bodyFat: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("BodyMetric", bodyMetricSchema);
