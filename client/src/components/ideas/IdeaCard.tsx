import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight, TrendingUp } from "lucide-react";
import VotePill from "./VotePill";
import { Idea } from "../../types";
import { Button } from "../ui/button";
import { useState } from "react";
import InterestModal from "./interestModal";
import { CATEGORY_LABELS } from "../../constants/categories";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Teknologi: { bg: "#EEF2FF", text: "#4F46E5" },
  Perniagaan: { bg: "#FFFBEB", text: "#D97706" },
  Kesihatan: { bg: "#ECFDF5", text: "#059669" },
  Pendidikan: { bg: "#F5F3FF", text: "#7C3AED" },
  Kewangan: { bg: "#FFF1F2", text: "#E11D48" },
};

const GRADIENT = "linear-gradient(135deg, #9B59D0, #D4609A, #E8745A)";

function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function IdeaCard({ idea, user }: { idea: Idea; user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const catColor = CATEGORY_COLORS[idea.category] ?? { bg: "#F1F5F9", text: "#475569" };

  return (
    <>
      <div
        onClick={() => navigate(`/idea/${idea.id}`)}
        className="group relative cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100/50 hover:border-purple-200/60 flex flex-col"
      >
        {/* Cover image */}
        <div className="relative h-28 overflow-hidden bg-gray-50 shrink-0">
          {idea.coverImageUrl ? (
            <img
              src={idea.coverImageUrl!}
              alt={idea.startupName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: GRADIENT }}
            >
              <span className="text-white text-5xl font-black opacity-20 select-none">
                {idea.startupName?.charAt(0) || "?"}
              </span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: catColor.bg, color: catColor.text }}
            >
              {CATEGORY_LABELS[idea.category] ?? idea.category}
            </span>
          </div>

          {/* Trending indicator if votes > 5 */}
          {idea.upvoteCount > 5 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[#9B59D0] text-xs font-semibold px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-3 flex flex-col flex-1">

          {/* Logo + title + founder */}
          <div className="flex items-start gap-3 mb-3">
            {idea.logoUrl ? (
              <img
                src={idea.logoUrl!}
                alt={idea.startupName}
                className="w-11 h-11 object-cover rounded-xl border border-gray-100 shrink-0"
              />
            ) : (
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
                style={{ background: GRADIENT }}
              >
                {idea.startupName?.charAt(0) || "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate leading-tight group-hover:text-[#9B59D0] transition-colors">
                {idea.startupName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                {idea.ownerProfilePicture ? (
                  <img
                    src={idea.ownerProfilePicture}
                    alt={idea.ownerName}
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                    style={{ background: GRADIENT }}
                  >
                    {initials(idea.ownerName)}
                  </div>
                )}
                <p className="text-xs text-slate-400 truncate">
                  {idea.ownerName}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed flex-1">
            {idea.shortDescription || "More details will be updated soon."}
          </p>

          {/* Industry interest button */}
          {user?.userType === "company" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              className="mt-2 w-fit px-4  flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: GRADIENT }}
            >
              Show Interest
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <VotePill ideaId={idea.id} commentCount={idea.commentCount} />
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {new Date(idea.createdAt).toLocaleDateString("en-MY", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Interest modal — outside card to avoid click propagation issues */}
      {user?.userType === "company" && (
        <InterestModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          ideaId={idea.id}
          startupName={idea.startupName}
        />
      )}
    </>
  );
}