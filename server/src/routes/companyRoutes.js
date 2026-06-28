import express from "express";
import { getCompanies, getCompanyProfile } from "../controllers/companyController.js";

const router = express.Router();

router.get("/", getCompanies);
router.get("/:id", getCompanyProfile);

export default router;
