import express from "express";
import {protect} from "../middleware/auth.js";
import { fetchComments,postComments } from "../controllers/commentController.js";

const router = express.Router();

router.get("/:id/comments", fetchComments);
router.post("/:id/comments", protect, postComments);

export default router;      