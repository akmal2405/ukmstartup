import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows  
  } catch (error) {
    throw error;
    
  }
}
  
export const insertCommunityUser = async (
  email, hashedPassword, userType, fullName, communityRole, faculty, matricNumber, yearOfStudy
) => {
  try {
    const result = await pool.query(
      `INSERT INTO users(email, password, user_type, full_name, community_role, faculty, matric_number, year_of_study)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, user_type, full_name, community_role`,
      [email, hashedPassword, userType, fullName  || null, communityRole || null, faculty || null, matricNumber || null, yearOfStudy || null]
    
    );
    return result.rows[0];
  } catch (error) {
    throw error;  
  }
}; 

export const insertCompanyUser = async (
  email, hashedPassword, userType, companyName, industry, contactPerson, phone
) => {
  try {
    const result = await pool.query(
      `INSERT INTO users (email, password, user_type, company_name, industry, contact_person, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, user_type,   company_name, contact_person`,
      [email, hashedPassword, userType, companyName || null, industry || null, contactPerson || null, phone || null]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};


export const findUserById = async (id) => {
  try {
    const result = await pool.query("SELECT id, email, user_type, full_name, contact_person FROM users WHERE id = $1",
       [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};  