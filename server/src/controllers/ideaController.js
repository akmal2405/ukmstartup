import {
  getAllIdeas,
  insertIdeas,
  getIdeaById,
  getIdeasByUserId,
  updateIdeaPitchDeck,
} from "../models/ideaModel.js";

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

    const { startupName, category, phoneNumber, shortDescription, status } =
      req.body;

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

export const getIdea = async (req, res) => {
  try {
    const idea = await getIdeaById(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: "Idea not found" });
    }
    res.json(idea);
  } catch (error) {
    console.error("GET IDEA ERROR:", error);
    res.status(500).json({ error: "Failed to fetch idea" });
  }
};

//export const updateIdea = async (req, res) => //

//export const deleteIdea = async (req, res) => //

export const getMyIdeas = async (req, res) => {
  try {
    const ideas = await getIdeasByUserId(req.user.id);
    res.json(ideas);
  } catch (error) {
    console.error("GET MY IDEAS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch my ideas" });
  }
};

export const updatePitchDeck = async (req, res) => {
  try {
    const { youtube_url } = req.body;
    const slidesUrl = req.file ? `/slides/${req.file.filename}` : null;
    const ideaId = req.params.id;

    const updatedIdea = await updateIdeaPitchDeck(
      ideaId,
      youtube_url,
      slidesUrl,
    );
    res.json(updatedIdea);
  } catch (error) {
    console.error("UPDATE PITCH DECK ERROR:", error);
    res.status(500).json({ error: "Failed to update pitch deck" });
  }
};
