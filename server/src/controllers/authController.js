import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      userType,
      fullName,
      communityRole,
      faculty,
      matricNumber,
      yearOfStudy,

      companyName,
      industry,
      contactPerson,
      phone

    } = req.body;

    // Validation
    if (!email || !password || !userType) {
      return res.status(400).json({ message: "Please provide email, password, and user type" });
    }

    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

      let result;

    if (userType === "community") {
       result = await pool.query(
        `INSERT INTO users (email, password, user_type, full_name, community_role, faculty, matric_number, year_of_study)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, user_type, full_name, community_role`,
        [email, hashedPassword, userType, fullName || null, communityRole || null, faculty || null, matricNumber || null, yearOfStudy || null]
      );
    }

    if (userType === "company") {
         result = await pool.query(
        `INSERT INTO users (email, password, user_type, company_name, industry, contact_person, phone)  
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, user_type, company_name`,
        [email, hashedPassword, userType,  companyName || null, industry || null, contactPerson || null, phone || null]
      );
    }


    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        fullName: user.full_name || user.contact_person,
        companyName: user.company_name,  
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        fullName: user.full_name || user.contact_person, 
        companyName: user.company_name,  
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};


//route  getME 
export const getMe = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT id, email, user_type, full_name, contact_person FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        userType: user.user_type,
        fullName: user.full_name || user.contact_person,
      },
    });

  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


