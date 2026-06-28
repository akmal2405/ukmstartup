import express from "express";
import {protect} from "../middleware/auth.js";
import { createInterest, deleteInterest, getInterests, getMyInterests, getMySentInterests, changeInterestStatus } from "../controllers/interestController.js";

const router = express.Router();

router.get("/my-interests", protect, getMyInterests);
router.get("/my-sent", protect, getMySentInterests);
router.put("/:id/status", protect, changeInterestStatus);
router.post("/:id", protect, createInterest);
router.delete("/:id", protect, deleteInterest);
router.get("/:id", protect, getInterests);

export default router;