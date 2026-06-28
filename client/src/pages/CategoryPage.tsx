import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Idea } from "../types";
import IdeaCard from "../components/ideas/IdeaCard";
import { CATEGORIES, CATEGORY_LABELS } from "../constants/categories";

function resolveCategory(slug: string): string {
  return (
    CATEGORIES.find((c) => c.toLowerCase() === slug) ??
    slug.charAt(0).toUpperCase() + slug.slice(1)
  );
}

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  const category = resolveCategory(categorySlug ?? "");

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/ideas?category=${encodeURIComponent(category)}`
        );
        const data: Idea[] = await res.json();
        setIdeas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, [category]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance mb-3  ">{CATEGORY_LABELS[category] ?? category}</h1>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-t-transparent rounded-full animate-spin border-2 border-indigo-500" />
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-24 text-slate-400 text-sm">
            No ideas in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
