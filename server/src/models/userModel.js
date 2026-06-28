import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      `SELECT
        id, email, password,
        full_name AS "fullName",
        user_type AS "userType",
        community_role AS "communityRole",
        company_name AS "companyName",
        industry,
        location,
        contact_person AS "contactPerson",
        phone,
        profile_pictures_url AS "profilePicture",
        email_verified AS "emailVerified",
        created_at AS "createdAt"
      FROM users WHERE email = $1`,
      [email],
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const insertCommunityUser = async (
  email,
  hashedPassword,
  userType,
  fullName,
  communityRole,
  faculty,
  matricNumber,
  yearOfStudy,
) => {
  try {
    const result = await pool.query(
      `INSERT INTO users(email, password, user_type, full_name, community_role, faculty, matric_number, year_of_study)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id, email,
        user_type AS "userType",
        full_name AS "fullName",
        community_role AS "communityRole"`,
      [
        email,
        hashedPassword,
        userType,
        fullName || null,
        communityRole || null,
        faculty || null,
        matricNumber || null,
        yearOfStudy || null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const insertCompanyUser = async (
  email,
  hashedPassword,
  userType,
  companyName,
  industry,
  contactPerson,
  phone,
) => {
  try {
    const result = await pool.query(
      `INSERT INTO users (email, password, user_type, company_name, industry, contact_person, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING
         id, email,
         user_type AS "userType",
         company_name AS "companyName",
         contact_person AS "contactPerson"`,
      [
        email,
        hashedPassword,
        userType,
        companyName || null,
        industry || null,
        contactPerson || null,
        phone || null,
      ],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const findUserById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT
        id, email,
        user_type AS "userType",
        full_name AS "fullName",
        community_role AS "communityRole",
        contact_person AS "contactPerson",
        company_name AS "companyName",
        profile_pictures_url AS "profilePicture",
        industry,
        location
      FROM users WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const getAllCompanies = async () => {
  try {
    const result = await pool.query(
      `SELECT
        users.id,
        users.company_name AS "companyName",
        users.industry,
        users.location,
        users.profile_pictures_url AS "profilePicture",
        COUNT(idea_interests.id) AS "interestCount"
      FROM users
      LEFT JOIN idea_interests ON idea_interests.company_id = users.id
      WHERE users.user_type = 'company'
      GROUP BY users.id, users.company_name, users.industry, users.location, users.profile_pictures_url
      ORDER BY "interestCount" DESC`,
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export const getCompanyById = async (id) => {
  const result = await pool.query(
    `SELECT
      users.id,
      users.company_name AS "companyName",
      users.industry,
      users.location,
      users.contact_person AS "contactPerson",
      users.phone,
      users.profile_pictures_url AS "profilePicture",
      users.created_at AS "createdAt",
      COUNT(idea_interests.id) AS "interestCount"
    FROM users
    LEFT JOIN idea_interests ON idea_interests.company_id = users.id
    WHERE users.id = $1 AND users.user_type = 'company'
    GROUP BY users.id`,
    [id],
  );
  return result.rows[0] ?? null;
};

export const searchCompanies = async (q) => {
  const term = `%${q}%`;
  const result = await pool.query(
    `SELECT
      users.id,
      users.company_name AS "companyName",
      users.industry,
      users.location,
      users.profile_pictures_url AS "profilePicture",
      COUNT(idea_interests.id) AS "interestCount"
    FROM users
    LEFT JOIN idea_interests ON idea_interests.company_id = users.id
    WHERE users.user_type = 'company'
      AND users.company_name ILIKE $1
    GROUP BY users.id, users.company_name, users.industry, users.location, users.profile_pictures_url
    ORDER BY "interestCount" DESC`,
    [term],
  );
  return result.rows;
};

export const setResetToken = async (userId, token, expires) => {
  await pool.query(
    `UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3`,
    [token, expires, userId],
  );
};

export const findUserByResetToken = async (token) => {
  const result = await pool.query(
    `SELECT id, email FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()`,
    [token],
  );
  return result.rows[0] ?? null;
};

export const resetPassword = async (userId, hashedPassword) => {
  await pool.query(
    `UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2`,
    [hashedPassword, userId],
  );
};

export const setVerificationToken = async (userId, token, expires) => {
  await pool.query(
    `UPDATE users
     SET verification_token = $1, verification_token_expires = $2
     WHERE id = $3`,
    [token, expires, userId],
  );
};

export const findUserByVerificationToken = async (token) => {
  const result = await pool.query(
    `SELECT id, email, email_verified AS "emailVerified",
            verification_token_expires AS "verificationTokenExpires"
     FROM users WHERE verification_token = $1`,
    [token],
  );
  return result.rows[0] ?? null;
};

export const markEmailVerified = async (userId) => {
  await pool.query(
    `UPDATE users
     SET email_verified = TRUE,
         verification_token = NULL,
         verification_token_expires = NULL
     WHERE id = $1`,
    [userId],
  );
};

export const updateUserProfile = async (
  id,
  fullName,
  email,
  profilePicture,
  location,
  companyName,
  industry,
  contactPerson,
) => {
  try {
    const result = await pool.query(
      `
      UPDATE users SET
        full_name = COALESCE($1, full_name),
        email = COALESCE($2, email),
        profile_pictures_url = COALESCE($3, profile_pictures_url),
        location = COALESCE($4, location),
        company_name = COALESCE($6, company_name),
        industry = COALESCE($7, industry),
        contact_person = COALESCE($8, contact_person)
      WHERE id = $5
      RETURNING
        id, email,
        full_name AS "fullName",
        profile_pictures_url AS "profilePicture",
        location,
        user_type AS "userType",
        company_name AS "companyName",
        industry,
        contact_person AS "contactPerson",
        community_role AS "communityRole"
      `,
      [fullName, email, profilePicture, location, id, companyName, industry, contactPerson],
    );
    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
