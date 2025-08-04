import { Router } from "express";
import limiter from "../middlewares/rate-limiter";
const authController = require("../controllers/authController");

const router = Router();

router.post("/send-otp", limiter, authController.sendOTP);

router.post("/verify-otp", limiter, authController.verifyOTP);

router.post("/change-password", limiter, authController.changePassword);

module.exports = router;
