import express from "express";
import multer from "multer";
import path from "path";
import { createIdeas, getIdeas, getIdea} from "../controllers/ideaController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ---------- MULTER CONFIG ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ---------- ROUTES ---------- */
router.get("/", getIdeas);
router.get("/:id", getIdea); 

router.post(
  "/",
  protect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  createIdeas
);

export default router;

