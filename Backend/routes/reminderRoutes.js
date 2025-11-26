const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createReminder,
  getReminders,
  deleteReminder,
} = require("../controllers/reminderController");

router.use(auth);
router.get("/", getReminders);
router.post("/", createReminder);
router.delete("/:id", deleteReminder);

module.exports = router;
