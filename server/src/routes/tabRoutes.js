import express from "express";
import {
  getTabs,
  createTab,
  deleteTab,
  updateTab,
} from "../controllers/tabController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:ideaId/tabs", getTabs);
router.post("/:ideaId/tabs", protect, createTab);
router.delete("/:ideaId/tabs/:tabId", protect, deleteTab);
router.put("/tabs/:tabId", protect, updateTab);

export default router;
