import express from "express";
import {protect} from "../middleware/auth.js";
import { showInterest, removeInterest, fetchInterests, fetchMyInterests } from "../controllers/interestController.js";

const router = express.Router();

router.get("/my-interests", protect, fetchMyInterests);
router.post("/:id", protect, showInterest);
router.delete("/:id", protect, removeInterest);
router.get("/:id", protect, fetchInterests)

export default router;