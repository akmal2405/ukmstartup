import { runAiEvaluation } from "../services/aiEvaluationService.js";

export const evaluateIdea = async (req, res) => {
  try {
    const { startupName, category, shortDescription } = req.body;

    if (!startupName || !category || !shortDescription) {
      return res.status(400).json({ message: "Missing idea details" });
    }

    const evaluation = await runAiEvaluation({ startupName, category, shortDescription });
    res.json(evaluation);
  } catch (error) {
    console.error("AI evaluation error:", error.message);
    res.status(500).json({ message: "Failed to evaluate idea" });
  }
};
