import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, insertCommunityUser, insertCompanyUser, findUserById } from "../models/userModel.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const {
      email, password, userType, fullName,
      communityRole, faculty, matricNumber, yearOfStudy,
      companyName, industry, contactPerson, phone
    } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: "Please provide email, password, and user type" });
    }

    // ✅ model instead of pool.query
    const userExists = await findUserByEmail(email);
    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;

    if (userType === "community") {
      // ✅ model instead of pool.query
      user = await insertCommunityUser(
        email, hashedPassword, userType,
        fullName, communityRole, faculty,
        matricNumber, yearOfStudy
      );
    }

    if (userType === "company") {
      // ✅ model instead of pool.query
      user = await insertCompanyUser(
        email, hashedPassword, userType,
        companyName, industry, contactPerson, phone
      );
    }

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // ✅ model instead of pool.query
    const users = await findUserByEmail(email);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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

export const getMe = async (req, res) => {
  try {
    // ✅ model instead of pool.query
    const user = await findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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