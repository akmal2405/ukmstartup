import {
  insertInterest,
  deleteInterest as deleteInterestById,
  getInterestsByIdeaId,
  getInterestsByOwnerId,
  getInterestsByCompanyId,
  getInterestWithIdeaOwner,
  updateInterestStatus,
  getInterestNotificationData,
} from "../models/interestModel.js";
import { insertNotification } from "../models/notificationModel.js";

const VALID_STATUSES = [
  "pending",
  "contacted",
  "in_discussion",
  "declined",
  "closed",
];

export const createInterest = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const company_id = req.user.id;
    const { message } = req.body;

    const interest = await insertInterest(idea_id, company_id, message);
    if (interest) {
      res.status(201).json({ message: "Interest shown successfully" });
      const data = await getInterestNotificationData(idea_id, company_id);
      if (data) {
        insertNotification(
          data.ideaOwnerId,
          company_id,
          "interest",
          idea_id,
          `${data.companyName} is interested in your idea "${data.ideaName}"`,
        );
      }
    } else {
      res.status(400).json({ message: "Interest already exists" });
    }
  } catch (error) {
    console.error("createInterest error:", error.message);
    res.status(500).json({ message: "Server error when showing interest" });
  }
};

export const deleteInterest = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const company_id = req.user.id;
    const interest = await deleteInterestById(idea_id, company_id);
    if (interest) {
      res.json({ message: "Interest removed successfully" });
    } else {
      res.status(400).json({ message: "Interest does not exist" });
    }
  } catch (error) {
    console.error("deleteInterest error:", error.message);
    res.status(500).json({ message: "Server error when removing interest" });
  }
};

export const getInterests = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const interests = await getInterestsByIdeaId(idea_id);
    res.json(interests);
  } catch (error) {
    console.error("getInterests error:", error.message);
    res.status(500).json({ message: "Server error when fetching interests" });
  }
};

export const getMyInterests = async (req, res) => {
  try {
    const interests = await getInterestsByOwnerId(req.user.id);
    res.json(interests);
  } catch (error) {
    console.error("getMyInterests error:", error);
    res.status(500).json({ message: "Failed to fetch my interests" });
  }
};

export const getMySentInterests = async (req, res) => {
  try {
    const interests = await getInterestsByCompanyId(req.user.id);
    res.json(interests);
  } catch (error) {
    console.error("getMySentInterests error:", error);
    res.status(500).json({ message: "Failed to fetch sent interests" });
  }
};

export const changeInterestStatus = async (req, res) => {
  try {
    const { id: interestId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const interest = await getInterestWithIdeaOwner(interestId);
    if (!interest) {
      return res.status(404).json({ message: "Interest not found" });
    }
    if (interest.ideaOwnerId !== userId) {
      return res
        .status(403)
        .json({ message: "Only the idea owner can change the status" });
    }

    const updated = await updateInterestStatus(interestId, status);
    res.json(updated);
  } catch (error) {
    console.error("changeInterestStatus error:", error.message);
    res
      .status(500)
      .json({ message: "Server error when updating interest status" });
  }
};
