import { 
  getExistingVote,
  getUserVote,
  getVoteCounts, 
  insertVote,
  deleteVote,      // ← add this
  updateVote,      // ← add this
  recalculateVoteCounts
} from "../models/voteModel.js";

export const voteIdea = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const user_id = req.user.id;
    const { voteType } = req.body;

    if (!["up", "down"].includes(voteType)) {
      return res.status(400).json({ message: "invalid vote type" });
    }

    const existing = await getExistingVote(idea_id, user_id);

    if (existing.length === 0) {        // ← fix 1: remove .rows
      await insertVote(idea_id, user_id, voteType);
    } else if (existing[0].vote_type === voteType) {
      await deleteVote(idea_id, user_id);
    } else {
      await updateVote(voteType, idea_id, user_id);
    }

    await recalculateVoteCounts(idea_id);
    const counts = await getVoteCounts(idea_id);
    const { upvote_count, downvote_count } = counts;

    res.json({
      upvote_count,
      downvote_count,
      net_score: upvote_count - downvote_count,
    });

  } catch (error) {
    console.error("voteIdea error:", error.message);
    res.status(500).json({ message: "Server error when voting" });
  }
};

export const getVotes = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const user_id = req.user.id;

    const counts = await getVoteCounts(idea_id);        // ← fix 3: correct name
    const { upvote_count, downvote_count } = counts;    // ← fix 4: destructure
    const userVote = await getUserVote(idea_id, user_id);

    res.json({
      upvote_count,
      downvote_count,
      net_score: upvote_count - downvote_count,
      user_vote: userVote?.vote_type || null,
    });

  } catch (error) {
    console.error("getVotes error:", error.message);
    res.status(500).json({ message: "Server error getting votes" });
  }
};