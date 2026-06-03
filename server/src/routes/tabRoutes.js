import express from "express";
import {
  getTabs,
  createTab,
  removeTab,
  editTab,
} from "../controllers/tabController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:ideaId/tabs", getTabs);
router.post("/:ideaId/tabs", protect, createTab);
router.delete("/tabs/:tabId", protect, removeTab);
router.put("/tabs/:tabId", protect, editTab);

export default router;
