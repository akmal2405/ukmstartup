import express from "express";
import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import {
  createIdea,
  getIdeas,
  getIdea,
  getMyIdeas,
  deleteIdea,
  updatePitchDeck,
  getTopVotedIdeas,
  fetchRelatedIdeas,
  clearPitchField,
  search,
} from "../controllers/ideaController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ---------- MULTER + CLOUDINARY CONFIG ---------- */
const imageStorage = new CloudinaryStorage({
  cloudinary: { v2: cloudinary },
  params: {
    folder: "ideas/images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage: imageStorage });

const slidesStorage = new CloudinaryStorage({
  cloudinary: { v2: cloudinary },
  params: {
    folder: "ideas/slides",
  },
});

const uploadSlides = multer({ storage: slidesStorage });

/* ---------- ROUTES ---------- */

router.get("/my-ideas", protect, getMyIdeas);
router.get("/top-voted", getTopVotedIdeas);
router.get("/search", search);
router.get("/:id/related", fetchRelatedIdeas);
router.get("/:id", getIdea);
router.delete("/:id", deleteIdea);
router.put(
  "/:id/pitch",
  protect,
  (req, res, next) => {
    console.log("reacjhed");
    next();
  },
  uploadSlides.single("slides"),
  (req, res, next) => {
    console.log("fniished");
    next();
  },
  updatePitchDeck,
);
router.patch("/:id/pitch/clear", protect, clearPitchField);
router.get("/", getIdeas);

router.post(
  "/",
  protect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  createIdea,
);

router.post(
  "/:id/pitch-deck",
  protect,
  uploadSlides.single("slides"),
  updatePitchDeck,
);

export default router;
