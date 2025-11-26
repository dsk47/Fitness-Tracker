const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { enqueue, getQueue } = require("../controllers/syncController");

router.use(auth);
router.get("/", getQueue);
router.post("/", enqueue);

module.exports = router;
