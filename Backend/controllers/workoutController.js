const Workout = require("../models/Workout");

exports.getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) { next(err); }
};

exports.addWorkout = async (req, res, next) => {
  try {
    const w = await Workout.create({ ...req.body, userId: req.user.id });
    res.status(201).json(w);
  } catch (err) { next(err); }
};
