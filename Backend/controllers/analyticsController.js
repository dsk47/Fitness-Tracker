const Workout = require("../models/Workout");
const Meal = require("../models/meal");

exports.getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todayWorkouts, last7Workouts, last7Meals] = await Promise.all([
      Workout.find({ userId, date: { $gte: todayStart, $lte: todayEnd } }),
      Workout.find({
        userId,
        date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      Meal.find({
        userId,
        date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const todayScore = todayWorkouts.reduce((s, w) => s + w.duration, 0); // simple
    const last7 = {
      workouts: last7Workouts.length,
      calories: last7Workouts.reduce((s, w) => s + (w.calories || 0), 0),
      steps: last7Workouts.reduce((s, w) => s + (w.steps || 0), 0),
    };

    // simple 7-day heatmap (active: did workout?)
    const heatmap = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = last7Workouts.filter(
        (w) => w.date >= dayStart && w.date <= dayEnd
      ).length;
      heatmap.push({ date: dayStart.toISOString().slice(0, 10), active: count > 0 });
    }

    res.json({
      fitnessScore: todayScore,
      todayScore,
      todayWorkouts: todayWorkouts.length,
      last7,
      heatmap,
      upcomingRoutine: null, // you can fill from reminders later
    });
  } catch (err) { next(err); }
};
