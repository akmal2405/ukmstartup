import { getAllCompanies, getCompanyById } from "../models/userModel.js";

export const getCompanies = async (req, res) => {
  try {
    const companies = await getAllCompanies();
    res.json({ companies });
  } catch (error) {
    console.error("getCompanies error:", error);
    res.status(500).json({ message: "Server error fetching companies" });
  }
};

export const getCompanyProfile = async (req, res) => {
  try {
    const company = await getCompanyById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (error) {
    console.error("getCompanyProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
