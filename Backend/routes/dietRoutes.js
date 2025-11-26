const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getMeals, addMeal } = require("../controllers/dietController");

router.use(auth);
router.get("/", getMeals);  // /api/meals?date=today
router.post("/", addMeal);

module.exports = router;
