const Meal = require("../models/meal");

exports.getMeals = async (req, res, next) => {
  try {
    const { date } = req.query; // "today" or ISO
    let filter = { userId: req.user.id };

    if (date === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    const meals = await Meal.find(filter).sort({ date: -1 });
    res.json(meals);
  } catch (err) { next(err); }
};

exports.addMeal = async (req, res, next) => {
  try {
    const meal = await Meal.create({ ...req.body, userId: req.user.id });
    res.status(201).json(meal);
  } catch (err) { next(err); }
};
