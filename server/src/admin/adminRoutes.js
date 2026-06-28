import express from "express";
import {
  getOverviewStats,
  getIdeasOverTime,
  getUserBreakdown,
  deleteUser,
  getUsers,
  getIdeas,
  deleteIdea,
} from "./adminController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ── Admin guard middleware ──────────────────────────────────────
// Runs after protect — rejects anyone who isn't admin
const isAdmin = (req, res, next) => {
  if (req.user?.communityRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

// All admin routes require auth + admin role
router.use(protect, isAdmin);

// ── Routes ─────────────────────────────────────────────────────
router.get("/stats", getOverviewStats);
router.get("/ideas-over-time", getIdeasOverTime);
router.get("/user-breakdown", getUserBreakdown);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/ideas", getIdeas);
router.delete("/ideas/:id", deleteIdea);

export default router;
