import express from "express";
import {protect} from "../middleware/auth.js";
import { showInterest, removeInterest, fetchInterests } from "../controllers/interestController.js";

const router = express.Router();

router.post("/:id/interest", protect, showInterest);
router.delete("/:id/interest", protect, removeInterest);
router.get("/:id/interests", protect, fetchInterests);

export default router;