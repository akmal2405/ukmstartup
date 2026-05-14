import { insertInterest, deleteInterest, getInterestsByIdeaId } from "../models/interestModel.js";

export const showInterest = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const company_id = req.user.id;
    const interest = await insertInterest(idea_id, company_id);
    if (interest) {
      res.status(201).json({ message: "Interest shown successfully" });
    } else {
      res.status(400).json({ message: "Interest already exists" });
    }
    } catch (error) {
    console.error("showInterest error:", error.message);
    res.status(500).json({ message: "Server error when showing interest" });
}
};

export const removeInterest = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const company_id = req.user.id;
    const interest = await deleteInterest(idea_id, company_id);
    if (interest) {
      res.json({ message: "Interest removed successfully" });
    } else {
      res.status(400).json({ message: "Interest does not exist" });
    }
  } catch (error) {
    console.error("removeInterest error:", error.message);
    res.status(500).json({ message: "Server error when removing interest" });
  }
};


export const fetchInterests = async (req, res) => {
  try {
    const {id: idea_id} = req.params;
    const interests =await getInterestsByIdeaId(idea_id);
    res.json(interests);
  } catch (error) {
    console.error("fetchInterests error:", error.message);
    res.status(500).json({ message: "Server error when fetching interests" });
  }
}