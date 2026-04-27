import pool from "../config/db.js";

export const getAllIdeas = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        ideas.id,
        ideas.startup_name,
        ideas.category,
        ideas.logo_url,
        ideas.cover_image_url,
        ideas.phone_number,
        ideas.short_description,
        ideas.created_at,
        users.full_name AS owner_name
      FROM ideas
      JOIN users ON ideas.user_id = users.id
      ORDER BY ideas.created_at DESC`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};


export const getIdeaById = async (id) => {
  try {
      const result = await pool.query(`SELECT 
      ideas.id, 
      ideas.startup_name, 
      ideas.category,
      ideas.phone_number, 
      ideas.logo_url, 
      ideas.cover_image_url,
      ideas.short_description, 
      ideas.status, 
      users.full_name AS owner_name 
      FROM ideas 
      JOIN users ON ideas.user_id  = users.id
      WHERE ideas.id = $1`, [id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  } 
  };

export const insertIdeas = async (
  userId,
  startupName,
  category,
  phoneNumber,
  logoPath,
  coverPath,
  shortDescription,
  status
) => {
  try {

    const result = await pool.query(
      `INSERT INTO ideas
       (user_id, startup_name, category, phone_number, logo_url, cover_image_url, short_description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING*`,
      [
        userId,
        startupName,
        category,
        phoneNumber,
        logoPath,
        coverPath,
        shortDescription,
        status || "draft",
      ]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
