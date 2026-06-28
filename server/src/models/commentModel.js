import pool from "../config/db.js";

export const getCommentsByIdeaId = async (idea_id) => {
  try {
    const result = await pool.query(
      `
      SELECT
        comments.id,
        comments.idea_id AS "ideaId",
        comments.user_id AS "userId",
        comments.content,
        comments.created_at AS "createdAt",
        COALESCE(
        NULLIF(users.full_name, ''),
        NULLIF(users.company_name, ''),
        users.email
) AS "authorName",
        users.profile_pictures_url AS "authorPicture"
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.idea_id = $1
      ORDER BY comments.created_at DESC
    `,
      [idea_id],
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const insertComments = async (idea_id, user_id, content) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO comments (idea_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [idea_id, user_id, content],
    );

    const comment = await pool.query(
      `
        SELECT
          comments.id,
          comments.idea_id AS "ideaId",
          comments.user_id AS "userId",
          comments.content,
          comments.created_at AS "createdAt",
          COALESCE(users.full_name, users.company_name, users.email) AS "authorName",
          ideas.user_id AS "ideaOwnerId",
          ideas.startup_name AS "ideaStartupName"
        FROM comments
        JOIN users ON comments.user_id = users.id
        JOIN ideas ON comments.idea_id = ideas.id
        WHERE comments.id = $1
      `,
      [result.rows[0].id],
    );
    return comment.rows[0];
  } catch (error) {
    throw error;
  }
};

export const deleteComments = async (comment_id, user_id) => {
  try {
    const result = await pool.query(
      `DELETE FROM comments WHERE id = $1 AND user_id = $2`,
      [comment_id, user_id],
    );
    return result;
  } catch (error) {
    throw error;
  }
};

//create, delete done
//ui delete
