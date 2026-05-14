import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Plus } from "lucide-react";
import IdeaCard from "../components/ideas/IdeaCard";
import { useAuth } from "../context/AuthContext";
import { useIdeas } from "../hooks/useIdeas";

const CATEGORIES = [
  "Semua",
  "Teknologi",
  "Perniagaan",
  "Kesihatan",
  "Pendidikan",
  "Kewangan",
];

export default function Dashboard() {
  const [query] = useState("");
  const [activeCat, setActiveCat] = useState("Semua");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filtered, loading } = useIdeas(query, activeCat);

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-fuchsia-400/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-2 md:py-20 text-white">
          <p className="text-sm font-display text-white mb-3 mt-6 tracking-wide uppercase">
            Selamat datang, {user?.fullName?.split(" ")[0]}
          </p>
          <h1 className="text-4xl font-display md:text-5xl lg:text-6xl font-black tracking-tighter max-w-3xl leading-[1.1]">
            Idea hari ini,{" "}
            <span className="text-white">syarikat esok.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-white max-w-xl font-light font-display leading-relaxed">
            Terokai idea startup terkini dari pelajar dan alumni UKM. Undi,
            sokong, dan bina masa depan bersama.
          </p>
        </div>
      </section>

      {/* ── STICKY CATEGORY FILTER ── */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((c) => {
              const active = activeCat === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-mono transition border ${active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-black-600 border-slate-200 hover:bg-slate-400 hover:text-slate-900"
                    }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── IDEA GRID ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-white w-full">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            hasFilter={!!query || activeCat !== "Semua"}
            onSubmit={() => navigate("/create-idea")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} user={user} />
            ))}
          </div>
        )}
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
        {hasFilter ? "Tiada padanan dijumpai" : "Belum ada idea startup"}
      </h3>
      <p className="text-slate-500 text-sm mb-6">
        {hasFilter
          ? "Cuba kata kunci atau kategori lain."
          : "Jadilah yang pertama berkongsi idea bernas anda."}
      </p>
      {!hasFilter && (
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition"
        >
          <Plus className="w-4 h-4" />
          Hantar Idea Anda
        </button>
      )}
    </div>
  );
}
