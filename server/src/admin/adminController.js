import {
  getAllUsers,
  getOverviewStats as fetchOverviewStats,
  getIdeasOverTime as fetchIdeasOverTime,
  getUserBreakdown as fetchUserBreakdown,
  deleteUser as deleteUserById,
  getAllIdeas,
  deleteIdea as deleteIdeaById,
} from "./adminModel.js";

export const getUsers = async (req, res) => {
  try {
    const data = await getAllUsers();
    res.json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOverviewStats = async (req, res) => {
  try {
    const stats = await fetchOverviewStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getIdeasOverTime = async (req, res) => {
  try {
    const data = await fetchIdeasOverTime();
    res.json(data);
  } catch (error) {
    console.error("Error fetching ideas over time:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserBreakdown = async (req, res) => {
  try {
    const data = await fetchUserBreakdown();
    res.json(data);
  } catch (error) {
    console.error("Error fetching user breakdown:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await deleteUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getIdeas = async (req, res) => {
  try {
    const data = await getAllIdeas();
    res.json(data);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteIdea = async (req, res) => {
  try {
    const idea = await deleteIdeaById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    res.json(idea);
  } catch (error) {
    console.error("Error deleting idea:", error);
    res.status(500).json({ message: "Failed to delete idea" });
  }
};
