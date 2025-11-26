const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getMetrics, addMetric } = require("../controllers/metricsController");

router.use(auth);
router.get("/", getMetrics);
router.post("/", addMetric);

module.exports = router;
