const { Router } = require("express");
const usersController = require("../controllers/usersController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

const router = Router();

router.get("/me", authenticate, usersController.me);
router.get("/", authenticate, authorize("ADMIN"), usersController.list);

module.exports = router;
