import pool from "../config/db.js";

export const getTabsByIdeaId = async (ideaId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM idea_tabs WHERE idea_id = $1`,
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
      `INSERT INTO idea_tabs (idea_id, title, content) VALUES ($1, $2, $3) RETURNING id`,
      [ideaId, title, content],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTab = async (tabId) => {
  try {
    const result = await pool.query(`DELETE FROM idea_tabs WHERE id = $1`, [
      tabId,
    ]);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTab = async (tabId, title, content) => {
  try {
    const result = await pool.query(
      `UPDATE idea_tabs SET title = $1, content = $2 WHERE id = $3 RETURNING *`,
      [title, content, tabId],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
