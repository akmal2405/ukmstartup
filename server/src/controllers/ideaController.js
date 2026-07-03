import {
  getAllIdeas,
  insertIdeas,
  getIdeaById,
  getIdeasByUserId,
  deleteIdea as deleteIdeaById,
  updateIdeaPitchDeck,
  updateIdeaGallery,
  fetchTopVotedIdeas,
  getRelatedIdeas,
  clearIdeaPitchField,
  searchIdeas,
  updateIdeaAiEvaluation,
  updateIdeaFields,
} from "../models/ideaModel.js";
import { searchCompanies } from "../models/userModel.js";
import { runAiEvaluation } from "../services/aiEvaluationService.js";

export const getIdeas = async (req, res) => {
  try {
    const { category } = req.query;
    const ideas = await getAllIdeas(category || null);
    res.json(ideas);
  } catch (error) {
    console.error("GET IDEAS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
};

export const createIdea = async (req, res) => {
  try {
    const logoPath = req.files?.logo ? req.files.logo[0].secure_url : null;
    const coverPath = req.files?.cover ? req.files.cover[0].secure_url : null;
    const { startupName, category, phoneNumber, shortDescription, status } = req.body;

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

    try {
      const evaluation = await runAiEvaluation({ startupName, category, shortDescription });
      await updateIdeaAiEvaluation(idea.id, evaluation);
      idea.aiScore = evaluation.score;
      idea.aiSummary = evaluation.summary;
      idea.aiStrengths = evaluation.strengths;
      idea.aiImprovements = evaluation.improvements;
      idea.aiVerdict = evaluation.verdict;
      idea.aiEvaluatedAt = new Date().toISOString();
    } catch (aiError) {
      console.error("AI evaluation failed (idea still created):", aiError.message);
    }

    res.status(201).json(idea);
  } catch (error) {
    console.error("CREATE IDEA ERROR:", error.message);
    res.status(500).json({ error: "Failed to create idea" });
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

export const deleteIdea = async (req, res) => {
  try {
    const existing = await getIdeaById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "idea not found" });
    }
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const idea = await deleteIdeaById(req.params.id);
    res.json(idea);
  } catch (error) {
    console.error("ERROR TO DELETE IDEA:", error);
    res.status(500).json({ error: "failed to delete idea" });
  }
};

export const updateIdea = async (req, res) => {
  try {
    const ideaId = req.params.id;
    const existing = await getIdeaById(ideaId);
    if (!existing) return res.status(404).json({ error: "Idea not found" });
    if (existing.userId !== req.user.id) return res.status(403).json({ error: "Not authorized" });

    const logoPath = req.files?.logo ? req.files.logo[0].secure_url : null;
    const coverPath = req.files?.cover ? req.files.cover[0].secure_url : null;
    const { startupName, category, phoneNumber, shortDescription } = req.body;

    const updated = await updateIdeaFields(ideaId, {
      startupName,
      category,
      phoneNumber,
      shortDescription,
      logoUrl: logoPath,
      coverImageUrl: coverPath,
    });

    try {
      const evaluation = await runAiEvaluation({ startupName, category, shortDescription });
      await updateIdeaAiEvaluation(ideaId, evaluation);
      updated.aiScore = evaluation.score;
      updated.aiSummary = evaluation.summary;
      updated.aiStrengths = evaluation.strengths;
      updated.aiImprovements = evaluation.improvements;
      updated.aiVerdict = evaluation.verdict;
      updated.aiEvaluatedAt = new Date().toISOString();
    } catch (aiError) {
      console.error("AI re-evaluation failed (update still saved):", aiError.message);
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE IDEA ERROR:", error.message);
    res.status(500).json({ error: "Failed to update idea" });
  }
};

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
    const ideaId = req.params.id;

    const existing = await getIdeaById(ideaId);
    if (!existing || existing.userId !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const slidesUrl = req.files?.slides?.[0]?.secure_url ?? null;
    const galleryUrls = (req.files?.galleryImages ?? []).map((f) => f.secure_url);

    await updateIdeaPitchDeck(ideaId, youtube_url, slidesUrl);

    if (galleryUrls.length > 0) {
      await updateIdeaGallery(ideaId, galleryUrls, req.user.id);
    }

    const final = await getIdeaById(ideaId);
    res.json(final);
  } catch (error) {
    console.error("UPDATE PITCH DECK ERROR:", error);
    res.status(500).json({ error: "Failed to update pitch deck" });
  }
};

export const getTopVotedIdeas = async (req, res) => {
  try {
    const data = await fetchTopVotedIdeas();
    res.json(data);
  } catch (error) {
    console.error("Error fetching top voted ideas:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearPitchField = async (req, res) => {
  try {
    const { field } = req.body;
    const ALLOWED = ["youtube_url", "slides_url", "gallery_image_urls"];
    if (!ALLOWED.includes(field)) {
      return res.status(400).json({ message: "Invalid field" });
    }
    const result = await clearIdeaPitchField(req.params.id, field, req.user.id);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Idea not found or not authorized" });
    }
    res.json({ message: "Field cleared" });
  } catch (error) {
    console.error("CLEAR PITCH FIELD ERROR:", error);
    res.status(500).json({ error: "Failed to clear field" });
  }
};

export const fetchRelatedIdeas = async (req, res) => {
  try {
    const { id } = req.params;
    const idea = await getIdeaById(id);
    const related = await getRelatedIdeas(idea.category, id);
    res.json(related);
  } catch (err) {
    console.log("error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const search = async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ ideas: [], companies: [] });
  try {
    const [ideas, companies] = await Promise.all([
      searchIdeas(q),
      searchCompanies(q),
    ]);
    res.json({ ideas, companies });
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ error: "Search failed" });
  }
};
