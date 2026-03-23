import express from "express";
import { voteIdea, getVotes } from "../controllers/voteController.js";
import { protect } from "../middleware/auth.js";


const router  = express.Router() ;

router.get("/:id/vote", protect, getVotes);

router.post("/:id/vote", protect, voteIdea);

export default router;
