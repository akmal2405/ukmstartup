import { getAllIdeas, insertIdeas } from "../models/ideaModel.js";

export const getIdeas = async (req, res) => {
  try {
    const ideas = await getAllIdeas();
    res.json(ideas);
  } catch (error) {
    console.error("GET IDEAS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
};

export const createIdeas = async (req, res) => {
  try {
    const logoPath = req.files?.logo
      ? `/image/${req.files.logo[0].filename}`
      : null;

    const coverPath = req.files?.cover
      ? `/image/${req.files.cover[0].filename}`
      : null;

    const {
      startupName,
      category,
      phoneNumber,
      shortDescription,
      status,
    } = req.body;

    const idea = await insertIdeas(
      req.user.id,
      startupName,
      category,
      phoneNumber,
      logoPath,
      coverPath,
      shortDescription,
      status || "draft",
    );
    res.status(201).json(idea);
  } catch (error) {
    console.error("CREATE IDEA ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

