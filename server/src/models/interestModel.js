import pool from "../config/db.js";

//export const getAllInterests = async () => {}//

export const insertInterest = async (idea_id, company_id, message) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO idea_interests (idea_id, company_id, message)
      VALUES ($1, $2, $3)
      ON CONFLICT (idea_id, company_id) DO NOTHING
      RETURNING
        id,
        idea_id AS "ideaId",
        company_id AS "companyId",
        message,
        created_at AS "createdAt"
    `,
      [idea_id, company_id, message],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteInterest = async (idea_id, company_id) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM idea_interests
      WHERE idea_id = $1 AND company_id = $2
      RETURNING
        id,
        idea_id AS "ideaId",
        company_id AS "companyId",
        message,
        created_at AS "createdAt"
    `,
      [idea_id, company_id],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getInterestsByIdeaId = async (idea_id) => {
  try {
    const result = await pool.query(
      `
      SELECT
        idea_interests.id,
        idea_interests.idea_id AS "ideaId",
        idea_interests.company_id AS "companyId",
        idea_interests.message,
        idea_interests.created_at AS "createdAt",
        users.company_name AS "companyName",
        users.industry,
        users.email
      FROM idea_interests
      JOIN users ON idea_interests.company_id = users.id
      WHERE idea_interests.idea_id = $1
    `,
      [idea_id],
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getInterestsByOwnerId = async (user_id) => {
  try {
    const result = await pool.query(
      `
      SELECT
        idea_interests.id,
        idea_interests.idea_id AS "ideaId",
        idea_interests.company_id AS "companyId",
        idea_interests.message,
        idea_interests.status,
        idea_interests.status_updated_at AS "statusUpdatedAt",
        idea_interests.created_at AS "createdAt",
        users.company_name AS "companyName",
        users.industry,
        users.email,
        users.profile_pictures_url AS "profilePicture",
        ideas.startup_name AS "ideaName"
      FROM idea_interests
      JOIN users ON idea_interests.company_id = users.id
      JOIN ideas ON idea_interests.idea_id = ideas.id
      WHERE ideas.user_id = $1
      ORDER BY idea_interests.created_at DESC
    `,
      [user_id],
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getInterestsByCompanyId = async (company_id) => {
  try {
    const result = await pool.query(
      `
      SELECT
        idea_interests.id,
        idea_interests.idea_id AS "ideaId",
        idea_interests.company_id AS "companyId",
        idea_interests.message,
        idea_interests.status,
        idea_interests.status_updated_at AS "statusUpdatedAt",
        idea_interests.created_at AS "createdAt",
        ideas.startup_name AS "ideaName",
        CASE
          WHEN idea_interests.status IN ('contacted', 'in_discussion', 'closed') THEN owner.email
          ELSE NULL
        END AS "ownerEmail"
      FROM idea_interests
      JOIN ideas ON idea_interests.idea_id = ideas.id
      JOIN users AS owner ON ideas.user_id = owner.id
      WHERE idea_interests.company_id = $1
      ORDER BY idea_interests.created_at DESC
      `,
      [company_id],
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getInterestWithIdeaOwner = async (interestId) => {
  try {
    const result = await pool.query(
      `
      SELECT
        idea_interests.id,
        idea_interests.idea_id AS "ideaId",
        idea_interests.company_id AS "companyId",
        idea_interests.status,
        ideas.user_id AS "ideaOwnerId"
      FROM idea_interests
      JOIN ideas ON idea_interests.idea_id = ideas.id
      WHERE idea_interests.id = $1
      `,
      [interestId],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getInterestNotificationData = async (idea_id, company_id) => {
  try {
    const result = await pool.query(
      `SELECT
        ideas.user_id AS "ideaOwnerId",
        ideas.startup_name AS "ideaName",
        u.company_name AS "companyName"
       FROM ideas, users u
       WHERE ideas.id = $1 AND u.id = $2`,
      [idea_id, company_id],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateInterestStatus = async (interestId, status) => {
  try {
    const result = await pool.query(
      `
      UPDATE idea_interests
      SET status = $1, status_updated_at = NOW()
      WHERE id = $2
      RETURNING id, status, status_updated_at AS "statusUpdatedAt"
      `,
      [status, interestId],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
