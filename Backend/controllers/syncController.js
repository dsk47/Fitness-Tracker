const SyncQueue = require("../models/SyncQueue");

exports.enqueue = async (req, res, next) => {
  try {
    const item = await SyncQueue.create({
      userId: req.user?.id || null,
      type: req.body.type,
      payload: req.body.payload || {},
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.getQueue = async (_req, res, next) => {
  try {
    const items = await SyncQueue.find({ processed: false });
    res.json(items);
  } catch (err) { next(err); }
};
