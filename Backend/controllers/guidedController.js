const Routine = require("../models/Routine");

exports.getRoutines = async (req, res, next) => {
  try {
    const all = await Routine.find({});
    const recommended = all.slice(0, 2); // simple logic
    res.json({ all, recommended });
  } catch (err) { next(err); }
};

exports.getRoutine = async (req, res, next) => {
  try {
    const r = await Routine.findById(req.params.id);
    if (!r) return res.status(404).json({ message: "Not found" });
    res.json(r);
  } catch (err) { next(err); }
};

// if later you want /guided/schedule you’ll call Reminder.create here
