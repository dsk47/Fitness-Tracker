const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getWorkouts, addWorkout } = require("../controllers/workoutController");

router.use(auth);
router.get("/", getWorkouts);
router.post("/", addWorkout);

module.exports = router;
