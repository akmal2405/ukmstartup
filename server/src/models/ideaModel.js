import pool from "../config/db.js";

export const getIdeasByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        user_id AS "userId",
        startup_name AS "startupName",
        category,
        short_description AS "shortDescription",
        cover_image_url AS "coverImageUrl",
        logo_url AS "logoUrl",
        phone_number AS "phoneNumber",
        youtube_url AS "youtubeUrl",
        slides_url AS "slidesUrl",
        status,
        upvote_count AS "upvoteCount",
        downvote_count AS "downvoteCount",
        created_at AS "createdAt"
      FROM ideas
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
      [userId],
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const getAllIdeas = async (category = null) => {
  try {
    const params = category ? [category] : [];
    const where = category ? `WHERE ideas.category = $1` : "";

    const result = await pool.query(`
      SELECT
        ideas.id,
        ideas.startup_name AS "startupName",
        ideas.category,
        ideas.logo_url AS "logoUrl",
        ideas.cover_image_url AS "coverImageUrl",
        ideas.phone_number AS "phoneNumber",
        ideas.short_description AS "shortDescription",
        ideas.created_at AS "createdAt",
        ideas.upvote_count AS "upvoteCount",
        ideas.downvote_count AS "downvoteCount",
        COALESCE(users.full_name, users.company_name) AS "ownerName",
        users.profile_pictures_url AS "ownerProfilePicture",
        COUNT(comments.id)::int AS "commentCount"
      FROM ideas
      JOIN users ON ideas.user_id = users.id
      LEFT JOIN comments ON comments.idea_id = ideas.id
      ${where}
      GROUP BY ideas.id, users.full_name, users.company_name, users.profile_pictures_url
      ORDER BY ideas.created_at DESC`, params);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const getIdeaById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT
      ideas.id,
      ideas.user_id AS "userId",
      ideas.startup_name AS "startupName",
      ideas.category,
      ideas.phone_number AS "phoneNumber",
      ideas.logo_url AS "logoUrl",
      ideas.cover_image_url AS "coverImageUrl",
      ideas.short_description AS "shortDescription",
      ideas.status,
      ideas.youtube_url AS "youtubeUrl",
      ideas.slides_url AS "slidesUrl",
      ideas.gallery_image_urls AS "galleryImageUrls",
      ideas.upvote_count AS "upvoteCount",
      ideas.downvote_count AS "downvoteCount",
      ideas.interest_count AS "interestCount",
      ideas.ai_score AS "aiScore",
      ideas.ai_summary AS "aiSummary",
      ideas.ai_strengths AS "aiStrengths",
      ideas.ai_improvements AS "aiImprovements",
      ideas.ai_verdict AS "aiVerdict",
      ideas.ai_evaluated_at AS "aiEvaluatedAt",
      users.full_name AS "ownerName",
      users.profile_pictures_url AS "ownerProfilePicture",
      users.community_role AS "ownerCommunityRole",
      users.faculty AS "ownerFaculty",
      users.year_of_study AS "ownerYearOfStudy",
      COUNT(comments.id) AS "commentCount"
      FROM ideas
      JOIN users ON ideas.user_id = users.id
      LEFT JOIN comments ON comments.idea_id = ideas.id
      WHERE ideas.id = $1
      GROUP BY ideas.id, users.full_name, users.profile_pictures_url, users.community_role, users.faculty, users.year_of_study`,
      [id],
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
  status,
) => {
  try {
    const result = await pool.query(
      `INSERT INTO ideas
       (user_id, startup_name, category, phone_number, logo_url, cover_image_url, short_description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING
         id,
         user_id AS "userId",
         startup_name AS "startupName",
         category,
         phone_number AS "phoneNumber",
         logo_url AS "logoUrl",
         cover_image_url AS "coverImageUrl",
         short_description AS "shortDescription",
         status,
         youtube_url AS "youtubeUrl",
         slides_url AS "slidesUrl",
         upvote_count AS "upvoteCount",
         downvote_count AS "downvoteCount",
         created_at AS "createdAt"`,
      [
        userId,
        startupName,
        category,
        phoneNumber,
        logoPath,
        coverPath,
        shortDescription,
        status || "draft",
      ],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateIdeaAiEvaluation = async (ideaId, { score, summary, strengths, improvements, verdict }) => {
  await pool.query(
    `UPDATE ideas
     SET ai_score = $2,
         ai_summary = $3,
         ai_strengths = $4,
         ai_improvements = $5,
         ai_verdict = $6,
         ai_evaluated_at = now()
     WHERE id = $1`,
    [ideaId, score, summary, strengths, improvements, verdict],
  );
};

export const updateIdeaFields = async (ideaId, { startupName, category, phoneNumber, shortDescription, logoUrl, coverImageUrl }) => {
  const result = await pool.query(
    `UPDATE ideas
     SET startup_name = $2,
         category = $3,
         phone_number = $4,
         short_description = $5,
         logo_url = COALESCE($6, logo_url),
         cover_image_url = COALESCE($7, cover_image_url)
     WHERE id = $1
     RETURNING
       id,
       user_id AS "userId",
       startup_name AS "startupName",
       category,
       phone_number AS "phoneNumber",
       logo_url AS "logoUrl",
       cover_image_url AS "coverImageUrl",
       short_description AS "shortDescription",
       status,
       youtube_url AS "youtubeUrl",
       slides_url AS "slidesUrl",
       upvote_count AS "upvoteCount",
       downvote_count AS "downvoteCount",
       interest_count AS "interestCount",
       created_at AS "createdAt"`,
    [ideaId, startupName, category, phoneNumber || null, shortDescription, logoUrl || null, coverImageUrl || null],
  );
  return result.rows[0];
};

export const deleteIdea = async (ideaId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM notifications WHERE idea_id = $1", [ideaId]);
    const result = await client.query("DELETE FROM ideas WHERE id = $1 RETURNING *", [ideaId]);
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateIdeaPitchDeck = async (ideaId, youtubeUrl, slidesUrl) => {
  try {
    const result = await pool.query(
      `UPDATE ideas
       SET youtube_url = COALESCE($2, youtube_url),
       slides_url = COALESCE($3, slides_url)
       WHERE id = $1
       RETURNING
         id,
         user_id AS "userId",
         startup_name AS "startupName",
         category,
         phone_number AS "phoneNumber",
         logo_url AS "logoUrl",
         cover_image_url AS "coverImageUrl",
         short_description AS "shortDescription",
         status,
         youtube_url AS "youtubeUrl",
         slides_url AS "slidesUrl",
         upvote_count AS "upvoteCount",
         downvote_count AS "downvoteCount",
         created_at AS "createdAt"`,
      [ideaId, youtubeUrl, slidesUrl],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const fetchTopVotedIdeas = async () => {
  const result = await pool.query(`
    SELECT
      ideas.id,
      ideas.logo_url AS "logoUrl",
      ideas.startup_name AS "startupName",
      ideas.upvote_count AS "upvoteCount",
      COALESCE(users.full_name, users.company_name) AS "authorName"
    FROM ideas
    JOIN users ON ideas.user_id = users.id
    ORDER BY ideas.upvote_count DESC
    LIMIT 5
  `);
  return result.rows;
};

export const clearIdeaPitchField = async (ideaId, field, userId) => {
  const queries = {
    youtube_url:        `UPDATE ideas SET youtube_url = NULL WHERE id = $1 AND user_id = $2`,
    slides_url:         `UPDATE ideas SET slides_url  = NULL WHERE id = $1 AND user_id = $2`,
    gallery_image_urls: `UPDATE ideas SET gallery_image_urls = NULL WHERE id = $1 AND user_id = $2`,
  };
  const sql = queries[field];
  if (!sql) throw new Error("Invalid field");
  const result = await pool.query(sql, [ideaId, userId]);
  return result;
};

export const updateIdeaGallery = async (ideaId, urls, userId) => {
  const result = await pool.query(
    `UPDATE ideas SET gallery_image_urls = $1 WHERE id = $2 AND user_id = $3`,
    [urls, ideaId, userId],
  );
  return result;
};

export const getRelatedIdeas = async (category, ideaId) => {
  const result = await pool.query(
    `SELECT
      ideas.id,
      ideas.startup_name AS "startupName",
      ideas.logo_url AS "logoUrl",
      ideas.category,
      ideas.short_description AS "shortDescription",
      ideas.upvote_count AS "upvoteCount",
      ideas.downvote_count AS "downvoteCount",
      COUNT(comments.id)::int AS "commentCount"
     FROM ideas
     LEFT JOIN comments ON comments.idea_id = ideas.id
     WHERE ideas.category = $1
       AND ideas.id != $2
     GROUP BY ideas.id
     LIMIT 3`,
    [category, ideaId],
  );
  return result.rows;
};

export const searchIdeas = async (q) => {
  const term = `%${q}%`;
  const result = await pool.query(
    `SELECT
      ideas.id,
      ideas.startup_name AS "startupName",
      ideas.category,
      ideas.logo_url AS "logoUrl",
      ideas.cover_image_url AS "coverImageUrl",
      ideas.phone_number AS "phoneNumber",
      ideas.short_description AS "shortDescription",
      ideas.created_at AS "createdAt",
      ideas.upvote_count AS "upvoteCount",
      ideas.downvote_count AS "downvoteCount",
      COALESCE(users.full_name, users.company_name) AS "ownerName",
      users.profile_pictures_url AS "ownerProfilePicture",
      COUNT(comments.id)::int AS "commentCount"
    FROM ideas
    JOIN users ON ideas.user_id = users.id
    LEFT JOIN comments ON comments.idea_id = ideas.id
    WHERE
      ideas.startup_name ILIKE $1
      OR ideas.short_description ILIKE $1
      OR ideas.category ILIKE $1
    GROUP BY ideas.id, users.full_name, users.company_name, users.profile_pictures_url
    ORDER BY ideas.created_at DESC`,
    [term],
  );
  return result.rows;
};
