import {
  getTabsByIdeaId,
  insertTab,
  deleteTab as deleteTabById,
  updateTab as updateTabById,
} from "../models/tabModel.js";

export const getTabs = async (req, res) => {
  try {
    const tabs = await getTabsByIdeaId(req.params.ideaId);
    res.json(tabs);
  } catch (error) {
    console.error("GET TABS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch tabs" });
  }
};

export const createTab = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newTab = await insertTab(req.params.ideaId, title, content);
    res.status(201).json(newTab);
  } catch (error) {
    console.error("CREATE TAB ERROR:", error);
    res.status(500).json({ message: "Failed to create tab" });
  }
};

export const deleteTab = async (req, res) => {
  try {
    const result = await deleteTabById(req.params.tabId, req.user.id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tab not found or not authorized" });
    }
    res.json({ message: "Tab deleted successfully" });
  } catch (error) {
    console.error("DELETE TAB ERROR:", error);
    res.status(500).json({ message: "Failed to delete tab" });
  }
};

export const updateTab = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedTab = await updateTabById(req.params.tabId, title, content);
    res.json(updatedTab);
  } catch (error) {
    console.error("UPDATE TAB ERROR:", error);
    res.status(500).json({ message: "Failed to update tab" });
  }
};
