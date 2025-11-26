const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getRoutines, getRoutine } = require("../controllers/guidedController");

router.use(auth);
router.get("/", getRoutines);
router.get("/:id", getRoutine);
// router.post("/schedule", auth, scheduleRoutine)  // later if needed

module.exports = router;
