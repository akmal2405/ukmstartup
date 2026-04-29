import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Comment } from "../types";

interface CommentSectionProps {
  ideaId: string | number;
}

export default function CommentSection({ ideaId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      <h3 className="font-bold text-gray-900 mb-4">Comments</h3>

      {user && (
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">
                    {comment.author_name?.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {comment.author_name}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString("en-MY")}
                </span>
              </div>
              <p className="text-sm text-gray-600 ml-9">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
