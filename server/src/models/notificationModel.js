import pool from "../config/db.js";

export const insertNotification = async (recipient_id, actor_id, type, idea_id, message) => {
  try {
    if (recipient_id === actor_id) return null;

    const result = await pool.query(
      `INSERT INTO notifications (recipient_id, actor_id, type, idea_id, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [recipient_id, actor_id, type, idea_id, message],
    );
    return result.rows[0];
  } catch (error) {
    console.error("insertNotification error:", error.message);
    return null;
  }
};

export const getNotificationsByUserId = async (user_id) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        type,
        message,
        idea_id AS "ideaId",
        is_read AS "isRead",
        created_at AS "createdAt"
       FROM notifications
       WHERE recipient_id = $1
       ORDER BY created_at DESC
       LIMIT 30`,
      [user_id],
    );
    return result.rows;
  } catch (error) {
    console.error("getNotificationsByUserId error:", error.message);
    throw error;
  }
};

export const markNotificationRead = async (notification_id, user_id) => {
  try {
    const result = await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = $1 AND recipient_id = $2
       RETURNING id`,
      [notification_id, user_id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("markNotificationRead error:", error.message);
    throw error;
  }
};

export const markAllNotificationsRead = async (user_id) => {
  try {
    await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE recipient_id = $1 AND is_read = FALSE`,
      [user_id],
    );
  } catch (error) {
    console.error("markAllNotificationsRead error:", error.message);
    throw error;
  }
};
