import express from "express";
import upload from "../config/multerCloudinary.js";
import { protect } from "../middleware/auth.js";
import {
  signup,
  login,
  getMe,
  editProfile,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  confirmPasswordReset,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", confirmPasswordReset);
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("profilePicture"), editProfile);

export default router;
