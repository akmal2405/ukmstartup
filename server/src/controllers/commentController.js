import { getCommentsByIdeaId, insertComments } from "../models/commentModel.js";

export const fetchComments = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const comments = await getCommentsByIdeaId(idea_id)
    res.json(comments);
  }
  catch (error) {
    console.error("fetchComments error:", error.message);
    res.status(500).json({ message: "Server error when fetching comments" });
  }
};

export const postComments = async (req, res) => {
  try {
    const{id: idea_id} = req.params; 
    const user_id = req.user.id;
    const {content} = req.body;
    const comments = await insertComments(idea_id, user_id, content);
    res.status(201).json(comments);
  } catch (error) {
    console.error("postComments error:", error.message);
    res.status(500).json({ message: "Server error when posting comment" });
    
  }
}
