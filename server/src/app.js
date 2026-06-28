import dotenv from "dotenv";
dotenv.config();
import express from "express";
import pool from "./config/db.js";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import ideaRoutes from "./routes/ideaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import interestRoutes from "./routes/interestRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import tabRoutes from "./routes/tabRoutes.js";
import adminRoutes from "./admin/adminRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);
app.use("/api/auth", authLimiter);

app.use("/api/ideas", voteRoutes);

app.use("/api/ideas", ideaRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/ideas", tabRoutes);

app.use("/api/ideas", commentRoutes);

app.use("/api/interests", interestRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/notifications", notificationRoutes);

// catch-all error handler — keeps multer/cloudinary failures as JSON, not HTML
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

// test route
app.get("/", (req, res) => {
  res.send("UKMStartUp API is running");
});

app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

export default app;
