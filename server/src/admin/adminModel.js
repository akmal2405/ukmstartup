import pool from "../config/db.js";

export const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT
      id,
      email,
      user_type AS "userType",
      full_name AS "fullName",
      contact_person AS "contactPerson",
      community_role AS "communityRole",
      company_name AS "companyName",
      industry,
      created_at AS "createdAt"
    FROM users
    ORDER BY created_at DESC
  `);
  return result.rows;
};

export const getOverviewStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM ideas)::int AS "totalIdeas",
      (SELECT COUNT(*) FROM users)::int AS "totalUsers",
      (SELECT COALESCE(SUM(upvote_count), 0) FROM ideas)::int AS "totalVotes",
      (SELECT COUNT(*) FROM comments)::int AS "totalComments"
  `);
  return result.rows[0];
};

export const getIdeasOverTime = async () => {
  const result = await pool.query(`
    SELECT
      TO_CHAR(created_at, 'Mon YYYY') AS month,
      DATE_TRUNC('month', created_at) AS "monthDate",
      COUNT(*)::int AS count
    FROM ideas
    WHERE created_at >= NOW() - INTERVAL '6 months'
    GROUP BY month, "monthDate"
    ORDER BY "monthDate" ASC
  `);
  return result.rows;
};
export const getUserBreakdown = async () => {
  const result = await pool.query(`
    SELECT
      CASE
        WHEN user_type = 'company' THEN 'Industry'
        WHEN community_role = 'student' THEN 'Student'
        WHEN community_role = 'lecturer' THEN 'Lecturer'
        WHEN community_role = 'staff' THEN 'Staff'
        WHEN community_role = 'admin' THEN 'Admin'
        ELSE 'Other'
      END AS label,
      COUNT(*)::int AS count
    FROM users
    GROUP BY label
    ORDER BY count DESC
  `);
  return result.rows;
};

export const deleteUser = async (userId) => {
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id`,
      [userId],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllIdeas = async () => {
  const result = await pool.query(`
    SELECT
      ideas.id,
      ideas.startup_name AS "startupName",
      ideas.category,
      ideas.status,
      ideas.upvote_count AS "upvoteCount",
      ideas.downvote_count AS "downvoteCount",
      ideas.created_at AS "createdAt",
      COALESCE(users.full_name, users.company_name) AS "ownerName"
    FROM ideas
    JOIN users ON ideas.user_id = users.id
    ORDER BY ideas.created_at DESC
  `);
  return result.rows;
};

export const deleteIdea = async (ideaId) => {
  try {
    // clear idea_id from notifications before deleting (FK constraint)
    await pool.query(`DELETE FROM notifications WHERE idea_id = $1`, [ideaId]);
    const result = await pool.query(
      `DELETE FROM ideas WHERE id = $1 RETURNING id`,
      [ideaId],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
