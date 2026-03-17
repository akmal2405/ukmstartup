import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Verify JWT token
export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query(
        "SELECT id, email, user_type FROM users WHERE id = $1",
        [decoded.id]
      );
      
      req.user = result.rows[0];
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// Check if user is community member
export const isCommunity = (req, res, next) => {
  if (req.user.user_type === "community") {
    next();
  } else {
    res.status(403).json({ message: "Community members only" });
  }
};

// Check if user is company
export const isCompany = (req, res, next) => {
  if (req.user.user_type === "company") {
    next();
  } else {
    res.status(403).json({ message: "Companies only" });
  }
};