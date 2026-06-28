import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Comment } from "../../types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";


interface CommentSectionProps {
  ideaId: string | number;
}

export default function CommentSection({ ideaId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${ideaId}/comments`);
        const data: Comment[] = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [ideaId]);

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    setDeletingId(commentId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${ideaId}/comments/${commentId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.ok) setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const newComment: Comment = await res.json();
      setComments([newComment, ...comments]);
      setContent("");
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Comments</h3>

      {user && (
        <div className="mb-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
            className="mt-2 w-min bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] disabled:bg-gray-300 text-white text-sm font-semibold py-1 px-2 rounded-lg transition-colors"
          >
            {submitting ? "Posting..." : "Comment"}
          </Button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  {comment.authorPicture ? (
                    <img src={comment.authorPicture} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-blue-600">
                      {(comment.authorName || "?").charAt(0)}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {comment.authorName || "User"}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString("en-MY")}
                </span>
              </div>
              <p className="text-sm text-slate-600 ml-9">{comment.content}</p>
              {user?.id === comment.userId && (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deletingId === comment.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
