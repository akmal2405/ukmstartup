import express from "express";
import { protect } from "../middleware/auth.js";
import { evaluateIdea } from "../controllers/aiController.js";

const router = express.Router();

router.post("/evaluate", protect, evaluateIdea);

export default router;