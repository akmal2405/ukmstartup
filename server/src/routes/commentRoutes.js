import express from "express";
import {protect} from "../middleware/auth.js";
import { getComments, createComment, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

router.get("/:id/comments", getComments);
router.post("/:id/comments", protect, createComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

export default router;      