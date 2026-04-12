import pool from "../config/db.js";

export const getExistingVote = async (idea_id, user_id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM votes WHERE idea_id = $1 AND user_id = $2`,
      [idea_id, user_id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const insertVote = async (idea_id, user_id, voteType) => {
  try {
    await pool.query(
      `INSERT INTO votes (idea_id, user_id, vote_type) VALUES ($1, $2, $3)`,
      [idea_id, user_id, voteType]
    );
  } catch (error) {
    throw error;
  }
};

export const deleteVote = async (idea_id, user_id) => {
  try {
    await pool.query(
      `DELETE FROM votes WHERE idea_id = $1 AND user_id = $2`,
      [idea_id, user_id]
    );
  } catch (error) {
    throw error;
  }
};

export const updateVote = async (voteType, idea_id, user_id) => {
  try {
    await pool.query(
      `UPDATE votes SET vote_type = $1 WHERE idea_id = $2 AND user_id = $3`,
      [voteType, idea_id, user_id]
    );
  } catch (error) {
    throw error;
  }
};

export const recalculateVoteCounts = async (idea_id) => {
  try {
    await pool.query(
      `UPDATE ideas SET 
        upvote_count = (SELECT COUNT(*) FROM votes WHERE idea_id = $1 AND vote_type = 'up'),
        downvote_count = (SELECT COUNT(*) FROM votes WHERE idea_id = $1 AND vote_type = 'down')
      WHERE id = $1`,
      [idea_id]
    );
  } catch (error) {
    throw error;
  }
};

export const getVoteCounts = async (idea_id) => {
  try {
    const result = await pool.query(
      `SELECT upvote_count, downvote_count FROM ideas WHERE id = $1`,
      [idea_id]
    );
    return result.rows[0];  // single row
  } catch (error) {
    throw error;
  }
};

export const getUserVote = async (idea_id, user_id) => {
  try {
    const result = await pool.query(
      `SELECT vote_type FROM votes WHERE idea_id = $1 AND user_id = $2`,
      [idea_id, user_id]
    );
    return result.rows[0];  // single row or undefined
  } catch (error) {
    throw error;
  }
};