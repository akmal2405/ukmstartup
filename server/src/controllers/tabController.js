import {
  getTabsByIdeaId,
  insertTab,
  deleteTab,
  updateTab,
} from "../models/tabModel.js";

export const getTabs = async (req, res) => {
  try {
    const tabs = await getTabsByIdeaId(req.params.ideaId);
    res.json(tabs);
  } catch (error) {
    console.error("GET TABS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch tabs" });
  }
};

export const createTab = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newTab = await insertTab(req.params.ideaId, title, content);
    res.status(201).json(newTab);
  } catch (error) {
    console.error("CREATE TAB ERROR:", error);
    res.status(500).json({ error: "Failed to create tab" });
  }
};

export const removeTab = async (req, res) => {
  try {
    await deleteTab(req.params.tabId);
    res.json({ message: "Tab deleted successfully" });
  } catch (error) {
    console.error("DELETE TAB ERROR:", error);
    res.status(500).json({ error: "Failed to delete tab" });
  }
};

export const editTab = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedTab = await updateTab(req.params.tabId, title, content);
    res.json(updatedTab);
  } catch (error) {
    console.error("UPDATE TAB ERROR:", error);
    res.status(500).json({ error: "Failed to update tab" });
  }
};
