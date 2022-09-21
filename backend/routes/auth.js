const express = require("express");
const router = express();
const authController = require("../controllers/auth");
const loginLimiter = require("../middleware/loginLimiter");

router.use(express.json());
router.route("/").post(loginLimiter, authController.login);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);
module.exports = router;
