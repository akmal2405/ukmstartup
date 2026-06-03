import express from "express";
import multer from "multer";
import path from "path";
import {
  createIdeas,
  getIdeas,
  getIdea,
  getMyIdeas,
  updatePitchDeck,
} from "../controllers/ideaController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ---------- MULTER CONFIG ---------- */
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: imageStorage });

const slidesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "slides/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadSlides = multer({ storage: slidesStorage });

/* ---------- ROUTES ---------- */

router.get("/my-ideas", protect, getMyIdeas);
router.get("/:id", getIdea);
router.put(
  "/:id/pitch",
  protect,
  uploadSlides.single("slides"),
  updatePitchDeck,
);
router.get("/", getIdeas);

router.post(
  "/",
  protect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  createIdeas,
);

router.post(
  "/:id/pitch-deck",
  protect,
  uploadSlides.single("slides"),
  updatePitchDeck,
);

export default router;
