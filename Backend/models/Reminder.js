const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    type: String,      // general | guided-session
    date: Date,
    time: String,      // "18:30"
    routineId: { type: mongoose.Schema.Types.ObjectId, ref: "Routine" },
    isSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
