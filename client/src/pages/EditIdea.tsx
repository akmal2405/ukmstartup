import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CreateIdeaForm from "../components/ideas/CreateIdeaForm";
import { Idea } from "../types";

export default function EditIdea() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          navigate("/my-ideas");
          return;
        }
        const data: Idea = await res.json();
        if (data.userId !== user?.id) {
          navigate("/my-ideas");
          return;
        }
        setIdea(data);
      } catch {
        navigate("/my-ideas");
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!idea) return null;

  const hasEngagement =
    (idea.upvoteCount ?? 0) + (idea.downvoteCount ?? 0) + (idea.commentCount ?? 0) > 0;

  return (
    <CreateIdeaForm
      ideaId={id}
      initialData={{
        startupName: idea.startupName,
        category: idea.category,
        phoneNumber: idea.phoneNumber || "",
        shortDescription: idea.shortDescription,
        logoUrl: idea.logoUrl,
        coverUrl: idea.coverImageUrl,
        hasEngagement,
      }}
    />
  );
}
