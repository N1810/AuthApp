import express from "express";
import * as authController from "../controllers/authController.js";
import { identifier } from "../middlewares/identification.js";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("status", authController.authStaus);
router.post("/2fa/setup", authController.setup2FA);
router.post("/2fa/verify", authController.verify2FA);
router.post("/2fa/reset", authController.reset2FA);
router.post("/signin", authController.signin);
router.post("/signout", identifier, authController.signout);
router.patch(
    "/send-verification-code",
    identifier,
    authController.sendVerificationCode
);
router.patch(
    "/verify-verification-code",
    identifier,
    authController.verifyVerificationCode
);
router.patch("/change-password", identifier, authController.changePassword);

router.get("/google", authController.googleAuth);

export default router;
