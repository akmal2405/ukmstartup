import pool from "../config/db.js";

export const getTabsByIdeaId = async (ideaId) => {
  try {
    const result = await pool.query(
      `SELECT id, idea_id AS "ideaId", title, content FROM idea_tabs WHERE idea_id = $1`,
      [ideaId],
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const insertTab = async (ideaId, title, content) => {
  try {
    const result = await pool.query(
      `INSERT INTO idea_tabs (idea_id, title, content) VALUES ($1, $2, $3) RETURNING id, idea_id AS "ideaId", title, content`,
      [ideaId, title, content],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTab = async (tabId, userId) => {
  try {
    const result = await pool.query(
      `DELETE FROM idea_tabs
       USING ideas
       WHERE idea_tabs.id = $1
         AND idea_tabs.idea_id = ideas.id
         AND ideas.user_id = $2`,
      [tabId, userId],
    );
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTab = async (tabId, title, content) => {
  try {
    const result = await pool.query(
      `UPDATE idea_tabs SET title = $1, content = $2 WHERE id = $3 RETURNING id, idea_id AS "ideaId", title, content`,
      [title, content, tabId],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//get, update, create, delete done
//ui not yet
