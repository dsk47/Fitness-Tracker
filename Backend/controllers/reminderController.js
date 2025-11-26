const Reminder = require("../models/Reminder");

exports.createReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.create({ ...req.body, userId: req.user.id });
    res.status(201).json(reminder);
  } catch (err) { next(err); }
};

exports.getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(reminders);
  } catch (err) { next(err); }
};

exports.deleteReminder = async (req, res, next) => {
  try {
    await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};
