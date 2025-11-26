const mongoose = require("mongoose");

const syncQueueSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: String, // e.g., 'STATS_UPDATE'
    payload: Object,
    processed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SyncQueue", syncQueueSchema);
