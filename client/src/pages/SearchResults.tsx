import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2 } from "lucide-react";
import IdeaCard from "../components/ideas/IdeaCard";
import { useAuth } from "../context/AuthContext";
import { Idea } from "../types";

interface Company {
  id: string;
  companyName: string;
  industry: string | null;
  location: string | null;
  profilePicture: string | null;
  interestCount: number;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { user } = useAuth();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setIdeas([]);
      setCompanies([]);
      return;
    }
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas/search?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => {
        setIdeas(data.ideas ?? []);
        setCompanies(data.companies ?? []);
      })
      .catch(() => {
        setIdeas([]);
        setCompanies([]);
      })
      .finally(() => setLoading(false));
  }, [q]);

  const total = ideas.length + companies.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#9B59D0", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">
        {q ? `Results for "${q}"` : "Search"}
      </h1>
      <p className="text-sm text-slate-400 mt-1 mb-8">
        {q && !loading && `${total} result${total !== 1 ? "s" : ""} found`}
      </p>

      {q && total === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <p className="text-base font-medium">No results for &ldquo;{q}&rdquo;</p>
          <p className="text-sm mt-1">Try a different keyword.</p>
        </div>
      )}

      {ideas.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Ideas <span className="text-slate-400 font-normal text-sm">({ideas.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} user={user} />
            ))}
          </div>
        </section>
      )}

      {companies.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Companies <span className="text-slate-400 font-normal text-sm">({companies.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {company.profilePicture ? (
                      <img
                        src={company.profilePicture}
                        alt={company.companyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {company.companyName ?? "Unnamed Company"}
                    </p>
                    {company.location && (
                      <p className="text-xs text-slate-400 truncate">{company.location}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {company.industry ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                      {company.industry}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-slate-400">
                    {company.interestCount}{" "}
                    {Number(company.interestCount) === 1 ? "idea" : "ideas"} interested in
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
