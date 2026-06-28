import { getCommentsByIdeaId, insertComments, deleteComments } from "../models/commentModel.js";
import { insertNotification } from "../models/notificationModel.js";

export const getComments = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const comments = await getCommentsByIdeaId(idea_id);
    res.json(comments);
  } catch (error) {
    console.error("getComments error:", error.message);
    res.status(500).json({ message: "Server error when fetching comments" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { id: idea_id } = req.params;
    const user_id = req.user.id;
    const { content } = req.body;
    const comment = await insertComments(idea_id, user_id, content);
    res.status(201).json(comment);
    insertNotification(
      comment.ideaOwnerId,
      user_id,
      "comment",
      idea_id,
      `${comment.authorName} commented on your idea "${comment.ideaStartupName}"`,
    );
  } catch (error) {
    console.error("createComment error:", error.message);
    res.status(500).json({ message: "Server error when posting comment" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const user_id = req.user.id;
    const result = await deleteComments(commentId, user_id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Comment not found or not authorized" });
    }
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error("deleteComment error:", error.message);
    res.status(500).json({ message: "Server error when deleting comment" });
  }
};
