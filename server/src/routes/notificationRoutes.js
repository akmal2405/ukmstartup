import express from "express";
import { getMyNotifications, readNotification, readAllNotifications } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.put("/read-all", protect, readAllNotifications);
router.put("/:id/read", protect, readNotification);

export default router;
