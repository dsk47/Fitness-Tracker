const BodyMetric = require("../models/BodyMetric");

exports.getMetrics = async (req, res, next) => {
  try {
    const metrics = await BodyMetric.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(metrics);
  } catch (err) { next(err); }
};

exports.addMetric = async (req, res, next) => {
  try {
    const metric = await BodyMetric.create({ ...req.body, userId: req.user.id });
    res.status(201).json(metric);
  } catch (err) { next(err); }
};
