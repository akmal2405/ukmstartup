import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import VotePill from "./VotePill";
import { Idea } from "../../types";
import { Button } from "../ui/button";
import { useState } from "react";
import InterestModal from "./interestModal";


const CATEGORY_STYLES: Record<string, string> = {
  Teknologi: "bg-blue-50 text-blue-700 ring-blue-200",
  Perniagaan: "bg-amber-50 text-amber-700 ring-amber-200",
  Kesihatan: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Pendidikan: "bg-violet-50 text-violet-700 ring-violet-200",
  Kewangan: "bg-rose-50 text-rose-700 ring-rose-200",
};


function initials(name?: string) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function IdeaCard({ idea, user }: { idea: Idea; user: any }) {
  const [isOpen, setIsOpen] = useState(false);  
  const navigate = useNavigate();
  const catClass = CATEGORY_STYLES[idea.category] ?? "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <div
      onClick={() => navigate(`/idea/${idea.id}`)}
      className="group relative cursor-pointer rounded-2xl p-[1.5px] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Gradient border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-500 transition-opacity duration-300 bg-[length:200%_200%] animate-gradient-pan"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      />
      <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-[var(--shadow-card)] group-hover:shadow-[var(--shadow-glow)] transition-shadow duration-300">
        {/* Cover image */}
        <div className="relative h-44 overflow-hidden bg-slate-100">
          {idea.cover_image_url ? (
            <img
              src={`http://localhost:5000${idea.cover_image_url}`}
              alt={idea.startup_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              <span className="text-white text-6xl font-black opacity-25">
                {idea.startup_name?.charAt(0) || "?"}
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full ring-1 backdrop-blur bg-white/90 ${catClass}`}>
              {idea.category}
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Logo + title + founder */}
          <div className="flex items-center gap-3 mb-3">
            {idea.logo_url ? (
              <img
                src={`http://localhost:5000${idea.logo_url}`}
                alt={idea.startup_name}
                className="w-12 h-12 object-cover rounded-xl border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                {idea.startup_name?.charAt(0) || "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-lg text-slate-900   truncate group-hover:text-indigo-600 transition-colors">
                {idea.startup_name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[9px] font-bold">
                  {initials(idea.owner_name)}
                </span>
                <p className="text-xs text-slate-500 truncate font-light">
                  by <span className="font-medium text-slate-700">{idea.owner_name}</span>
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px] font-light leading-relaxed">
            {idea.short_description || "Maklumat lanjut akan dikemaskini tidak lama lagi."}
          </p>

          {user?.userType === "company" && ( <>
            <Button
              variant="default"
              size="lg"
              onClick=
                {(e) => { e.stopPropagation()
                setIsOpen(true)}
                }
              className="inline-flex items-center justify-center bg-white text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-right"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Tunjukkan Minat
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>

            <InterestModal 
              isOpen={isOpen}
              onClose={() => setIsOpen(false)} 
              ideaId={idea.id}
              startupName={idea.startup_name}
            />
            </>
          )}


          {/* Footer: votes + timestamp */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <VotePill ideaId={idea.id} commentCount={idea.comment_count} />
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {new Date(idea.created_at).toLocaleDateString("en-MY", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}

            </span>
          </div>
        </div>
      </div>
    </div>
  );
}