// server.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const errorHandler = require("./middleware/errorHandler");

const app = express();
connectDB();

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
