import express from "express";
import { createVote, getVotes } from "../controllers/voteController.js";
import { protect } from "../middleware/auth.js";


const router  = express.Router() ;

router.get("/:id/vote", protect, getVotes);

router.post("/:id/vote", protect, createVote);

export default router;
