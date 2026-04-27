import pool from "../config/db.js";

export const getCommentsByIdeaId = async (idea_id) => {
  try{
    const result = await pool.query(`
      SELECT 
        comments.id,
        comments.content,
        comments.created_at,
        users.full_name AS author_name
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.idea_id = $1 
      ORDER BY comments.created_at DESC
    `, [idea_id]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;

  } 
};

export const insertComments = async (idea_id, user_id, content) => {
  try {
    const result = await pool.query (`
      INSERT INTO comments (idea_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING * 
      `, [idea_id, user_id, content]);

      const comment = await pool.query(`
        SELECT 
          comments.id,
          comments.content,
          comments.created_at,
          users.full_name AS author_name
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.id = $1 
      `, [result.rows[0].id]);
      return comment.rows[0];
  } catch (error) {
    throw error;
  }
}


export const deleteComments = async  (comment_id, user_id) => {
  try {
    const result = await pool.query(
      `DELETE FROM comments
      WHERE id = $1 AND user_id = $2
      `, [comment_id, user_id]
    );
  } catch (error) {
    throw error;
  }
   
}
 