import pool from "../config/db.js";


export const getIdeas = async (req, res) => {
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
      ORDER BY ideas.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("GET IDEAS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
};

export const createIdeas = async (req, res) => {
  try {
    const logoPath = req.files?.logo
      ? `/image/${req.files.logo[0].filename}`
      : null;

    const coverPath = req.files?.cover
      ? `/image/${req.files.cover[0].filename}`
      : null;

    const {
      startupName,
      category,
      phoneNumber,
      shortDescription,
      status,
    } = req.body;


    const result = await pool.query(
      `INSERT INTO ideas
       (user_id, startup_name, category, phone_number, logo_url, cover_image_url, short_description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING*`,
       [
        req.user.id,
        startupName,
        category,
        phoneNumber,
        logoPath,
        coverPath,
        shortDescription,
        status || "draft",
      ]

    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE IDEA ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

