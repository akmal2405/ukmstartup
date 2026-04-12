import dotenv from "dotenv";
dotenv.config()
import express from "express";
import pool from "./config/db.js";
import cors from "cors";
import ideaRoutes from "./routes/ideaRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";


const app = express();



app.use("/image", express.static("image"));

app.use(cors());
app.use(express.json());

app.use("/api/ideas", voteRoutes);

app.use("/api/ideas", ideaRoutes);

app.use("/api/auth", authRoutes);


// test route
app.get("/", (req, res) => {
  res.send("UKMStartUp API is running");
});


app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

export default app;
