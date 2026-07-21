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
  updateIdea,
  updatePitchDeck,
  getTopVotedIdeas,
  getTopCategory,
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

const pitchStorage = new CloudinaryStorage({
  cloudinary: { v2: cloudinary },
  params: (req, file, cb) => {
    if (file.fieldname === "slides") {
      const base = file.originalname.replace(/\.[^/.]+$/, "");
      return cb(null, {
        folder: "ideas/slides",
        resource_type: "raw",
        public_id: `${Date.now()}-${base}.pdf`,
      });
    }
    cb(null, {
      folder: "ideas/gallery",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    });
  },
});

const uploadPitch = multer({ storage: pitchStorage });

/* ---------- ROUTES ---------- */

router.get("/my-ideas", protect, getMyIdeas);
router.get("/top-voted", getTopVotedIdeas);
router.get("/top-category", getTopCategory);
router.get("/search", search);
router.get("/:id/related", fetchRelatedIdeas);
router.get("/:id", getIdea);
router.delete("/:id", protect, deleteIdea);
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  updateIdea,
);
router.put(
  "/:id/pitch",
  protect,
  uploadPitch.fields([{ name: "slides", maxCount: 1 }, { name: "galleryImages", maxCount: 5 }]),
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
  uploadPitch.fields([{ name: "slides", maxCount: 1 }, { name: "galleryImages", maxCount: 5 }]),
  updatePitchDeck,
);

export default router;
