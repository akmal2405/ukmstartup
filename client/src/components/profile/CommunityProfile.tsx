import { useState } from "react";
import { Plus, MessageSquare, TrendingUp, ThumbsUp, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ── CONSTANTS (outside component — never changes) ──────────────────────────

const TABS = [
  { id: "ideas", label: "Idea Saya" },
  { id: "interest", label: "Minat Industri" },
  { id: "about", label: "Tentang" },
];

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  approved: "Diluluskan",
  pending: "Dalam Semakan",
  rejected: "Ditolak",
};

// ── DUMMY DATA (replace with real API later) ───────────────────────────────

const dummyIdeas = [
  {
    id: 1,
    company_name: "EduTech Malaysia",
    category: "Pendidikan",
    status: "approved",
    upvotes: 24,
    comments: 8,
  },
  {
    id: 2,
    company_name: "HealthSync",
    category: "Kesihatan",
    status: "pending",
    upvotes: 11,
    comments: 3,
  },
];

const dummyInterests = [
  {
    id: 1,
    company_name: "TechCorp Sdn Bhd",
    industry: "Teknologi",
    message: "Kami berminat untuk membincangkan peluang pelaburan dalam idea ini.",
    created_at: "2 hari lepas",
    email: "contact@techcorp.com",
  },
  {
    id: 2,
    company_name: "Modal Ventures",
    industry: "Kewangan",
    message: "",
    created_at: "5 hari lepas",
    email: "hello@modalventures.com",
  },
  {
    id: 3,
    company_name: "Nexus Industries",
    industry: "Perniagaan",
    message: "Idea yang sangat menarik! Kami ingin mengetahui lebih lanjut tentang model perniagaan anda.",
    created_at: "1 minggu lepas",
    email: "info@nexus.com.my",
  },
];

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function CommunityProfile() {
  const { user } = useAuth();

  // which tab is active — default is "ideas"
  const [activeTab, setActiveTab] = useState("ideas");

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6 py-6 bg-white">

      {/* ── PROFILE HEADER ── */}
      <section className="p-6 bg-white">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {user?.fullName || "Pengguna"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 capitalize">
              {user?.communityRole}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Joined 2025</p>
          </div>
          <button className="ml-auto text-sm font-medium px-4 py-2 rounded-lg  text-slate-600 hover:underline transition">
            Edit Profil
          </button>
        </div>
      </section>

     

      {/* ── TABS ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Tab Bar */}
        <div className="flex border-b border-slate-200 px-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">

          {/* ── TAB: IDEA SAYA ── */}
          {activeTab === "ideas" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Idea Saya</h2>
                <button className="inline-flex items-center gap-1 text-sm font-semibold px-3.5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
                  <Plus className="w-4 h-4" />
                  Idea Baru
                </button>
              </div>
              <div className="space-y-3">
                {dummyIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {idea.company_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {idea.company_name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{idea.category}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[idea.status]}`}>
                      {STATUS_LABELS[idea.status]}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" /> {idea.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> {idea.comments}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: MINAT INDUSTRI ── */}
          {activeTab === "interest" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Minat Industri</h2>
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {dummyInterests.length} syarikat
                </span>
              </div>

              {dummyInterests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Belum ada syarikat yang menunjukkan minat.
                </div>
              ) : (
                <div className="space-y-4">
                  {dummyInterests.map((interest) => (
                    <div
                      key={interest.id}
                      className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50"
                    >
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {interest.company_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-900 text-sm">
                            {interest.company_name}
                          </p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {interest.industry}
                          </span>
                          <span className="text-xs text-slate-400 ml-auto">
                            {interest.created_at}
                          </span>
                        </div>
                        {interest.message ? (
                          <div className="flex items-start gap-1.5 mt-2">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {interest.message}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 mt-1 italic">
                            Tiada mesej disertakan.
                          </p>
                        )}
                      </div>
                      <a
                        href={`mailto:${interest.email}`}
                        className="flex-shrink-0 text-sm font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        Hubungi
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: TENTANG ── */}
          {activeTab === "about" && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Tentang</h2>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex gap-3">
                  <span className="text-slate-400 w-24 flex-shrink-0">Nama</span>
                  <span className="font-medium text-slate-900">{user?.fullName || "—"}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-400 w-24 flex-shrink-0">Peranan</span>
                  <span className="font-medium text-slate-900 capitalize">{user?.communityRole || "—"}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-400 w-24 flex-shrink-0">Institusi</span>
                  <span className="font-medium text-slate-900">UKM</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-slate-400 w-24 flex-shrink-0">Emel</span>
                  <span className="font-medium text-slate-900">{user?.email || "—"}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}