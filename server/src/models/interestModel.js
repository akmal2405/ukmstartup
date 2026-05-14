
import pool from "../config/db.js";

//export const getAllInterests = async () => {}//

export const insertInterest = async (idea_id, company_id) => {
  try {
    const result = await pool.query(`
      INSERT INTO idea_interests (idea_id, company_id)
      VALUES ($1, $2)
      ON CONFLICT (idea_id, company_id) DO NOTHING
      RETURNING *
    `, [idea_id, company_id]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const deleteInterest = async (idea_id, company_id) => {
  try {
    const result = await pool.query(`
      DELETE FROM idea_interests
      WHERE idea_id = $1 AND company_id = $2
      RETURNING *
    `, [idea_id, company_id]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getInterestsByIdeaId = async (idea_id) => {
  try {
    const result = await pool.query(`
      SELECT idea_interests.*, users.company_name, users.industry
      FROM idea_interests
      JOIN users ON idea_interests.company_id = users.id
      WHERE idea_interests.idea_id = $1
    `, [idea_id]);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

