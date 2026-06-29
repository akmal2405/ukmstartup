import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import IdeaCard from "../components/ideas/IdeaCard";
import { useAuth } from "../context/AuthContext";
import { useIdeas } from "../hooks/useIdeas";
import { TopIdea } from "@/types";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filtered, loading } = useIdeas(query, "Semua");
  const [topIdeas, setTopIdeas] = useState<TopIdea[]>([]);
  const [topLoading, setTopLoading] = useState(true);

  useEffect(() => {
    const fetchTopIdeas = async () => {
      setTopLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/top-voted`);
        const data: TopIdea[] = await res.json();
        setTopIdeas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setTopLoading(false);
      }
    };
    fetchTopIdeas();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mr-auto px-4 sm:px-6 py-6">

        {/* ── GREETING ── */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">
            Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
          </h1>
        </div>

        <div className="flex gap-6">

          {/* ── IDEA GRID ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                hasFilter={!!query}
                onSubmit={() => navigate("/create-idea")}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} user={user} />
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-24 space-y-4">

              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Top Voted Ideas</p>
                {topLoading ? (
                  <p className="text-xs text-gray-400">Loading...</p>
                ) : topIdeas.length === 0 ? (
                  <p className="text-xs text-gray-400">No votes yet.</p>
                ) : (
                  <div className="space-y-3">
                    {topIdeas.map((idea, index) => (
                      <Link
                        to={`/idea/${idea.id}`}
                        key={idea.id}
                        className="flex items-center gap-3 -mx-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition"
                      >
                        <span className="text-xs font-bold text-gray-400 w-4">{index + 1}</span>
                        {idea.logoUrl ? (
                          <img
                            src={idea.logoUrl}
                            alt={idea.startupName}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-purple-600">
                              {idea.startupName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{idea.startupName}</p>
                          <p className="text-xs text-gray-400">▲ {idea.upvoteCount} votes</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">📊 Quick Stats</p>
                <p className="text-xs text-gray-400">{filtered.length} ideas shown</p>
              </div>

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

// ── EMPTY STATE ──
function EmptyState({
  hasFilter,
  onSubmit,
}: {
  hasFilter: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto mt-8">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md mb-4">
        <Rocket className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        {hasFilter ? "No matches found" : "No startup ideas yet"}
      </h3>
      <p className="text-slate-500 text-sm mb-6">
        {hasFilter
          ? "Try a different keyword or category."
          : "Be the first to share your brilliant idea."}
      </p>
      {!hasFilter && (
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition"
        >
          <Plus className="w-4 h-4" />
          Submit Your Idea
        </button>
      )}
    </div>
  );
}