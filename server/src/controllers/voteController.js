import {
  getExistingVote,
  getUserVote,
  getVoteCounts,
  insertVote,
  deleteVote,
  updateVote,
  recalculateVoteCounts,
  getVoteNotificationData,
} from "../models/voteModel.js";
import { insertNotification } from "../models/notificationModel.js";

export const createVote = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const user_id = req.user.id;
    const { voteType } = req.body;

    if (!["up", "down"].includes(voteType)) {
      return res.status(400).json({ message: "invalid vote type" });
    }

    const existing = await getExistingVote(idea_id, user_id);

    let notifyVoteType = null;
    let newUserVote = null; // what the user's vote state is AFTER this action
    if (existing.length === 0) {
      await insertVote(idea_id, user_id, voteType);
      notifyVoteType = voteType;
      newUserVote = voteType;
    } else if (existing[0].voteType === voteType) {
      await deleteVote(idea_id, user_id);
      newUserVote = null; // toggled off
    } else {
      await updateVote(voteType, idea_id, user_id);
      notifyVoteType = voteType;
      newUserVote = voteType; // switched
    }

    await recalculateVoteCounts(idea_id);
    const counts = await getVoteCounts(idea_id);
    const { upvoteCount, downvoteCount } = counts;

    res.json({
      upvoteCount,
      downvoteCount,
      netScore: upvoteCount - downvoteCount,
      userVote: newUserVote,
    });

    if (notifyVoteType) {
      const data = await getVoteNotificationData(idea_id, user_id);
      if (data) {
        const type = notifyVoteType === "up" ? "upvote" : "downvote";
        const verb = notifyVoteType === "up" ? "upvoted" : "downvoted";
        insertNotification(
          data.ideaOwnerId,
          user_id,
          type,
          idea_id,
          `${data.actorName} ${verb} your idea "${data.ideaName}"`,
        );
      }
    }

  } catch (error) {
    console.error("voteIdea error:", error.message);
    res.status(500).json({ message: "Server error when voting" });
  }
};

export const getVotes = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const user_id = req.user.id;

    const counts = await getVoteCounts(idea_id);
    const { upvoteCount, downvoteCount } = counts;
    const userVote = await getUserVote(idea_id, user_id);

    res.json({
      upvoteCount,
      downvoteCount,
      netScore: upvoteCount - downvoteCount,
      userVote: userVote?.voteType || null,
    });

  } catch (error) {
    console.error("getVotes error:", error.message);
    res.status(500).json({ message: "Server error getting votes" });
  }
};