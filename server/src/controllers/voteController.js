import pool from "../config/db.js";

export const voteIdea = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const user_id = req.user.id;
    const { voteType } = req.body;

    if (!["up", "down"].includes(voteType)) {
      return res.status(400).json({ message: "invalid vote type" });
    }

    const existing = await pool.query(
      `SELECT * FROM votes WHERE idea_id = $1 AND user_id = $2`,
      [idea_id, user_id]
    );

    // Case 1: user hasnt voted yet
    if (existing.rows.length === 0) {
        console.log("Case 1: new vote");
      await pool.query(
        `INSERT INTO votes (idea_id, user_id, vote_type) VALUES ($1, $2, $3)`,
        [idea_id, user_id, voteType]
      );

    // Case 2: user clicked same vote — remove it
    } else if (existing.rows[0].vote_type === voteType) {
       console.log("Case 2: toggle off");
      await pool.query(
        `DELETE FROM votes WHERE idea_id = $1 AND user_id = $2`,
        [idea_id, user_id]
      );

    // Case 3: user clicked opposite vote — switch it
    } else {
       console.log("Case 3: switch vote");
      await pool.query(
        `UPDATE votes SET vote_type = $1 WHERE idea_id = $2 AND user_id = $3`,
        [voteType, idea_id, user_id]
      );
    }

    // Recalculate counts directly from votes table — always accurate
    await pool.query(
      `UPDATE ideas SET 
        upvote_count = (SELECT COUNT(*) FROM votes WHERE idea_id = $1 AND vote_type = 'up'),
        downvote_count = (SELECT COUNT(*) FROM votes WHERE idea_id = $1 AND vote_type = 'down')
      WHERE id = $1`,
      [idea_id]
    );

    const updated = await pool.query(
      `SELECT upvote_count, downvote_count FROM ideas WHERE id = $1`,
      [idea_id]
    );
    const { upvote_count, downvote_count } = updated.rows[0];

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

    const idea = await pool.query(
      `SELECT upvote_count, downvote_count FROM ideas WHERE id = $1`,
      [idea_id]
    );

    const userVote = await pool.query(
      `SELECT vote_type FROM votes WHERE idea_id = $1 AND user_id = $2`,
      [idea_id, user_id]
    );

    const { upvote_count, downvote_count } = idea.rows[0];

    res.json({
      upvote_count,
      downvote_count,
      net_score: upvote_count - downvote_count,
      user_vote: userVote.rows[0]?.vote_type || null,
    });

  } catch (error) {
    console.error("getVotes error:", error.message);
    res.status(500).json({ message: "Server error getting votes" });
  }
};