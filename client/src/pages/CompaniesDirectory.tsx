import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Company {
  id: string;
  companyName: string;
  industry: string | null;
  location: string | null;
  profilePicture: string | null;
  interestCount: number;
}

export default function CompaniesDirectory() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/companies`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch companies");
        return res.json();
      })
      .then((data) => setCompanies(data.companies))
      .catch(() => setError("Could not load companies. Please try again."))
      .finally(() => setLoading(false));
  }, []);

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight text-balance">
        Companies
      </h1>
      <p className="text-slate-500 mt-1">

        {companies.length} industry partner{companies.length !== 1 ? "s" : ""} on the platform
      </p>
      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Building2 className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-sm">No companies have joined yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {companies.map((company) => (
            <Link
              key={company.id}
              to={`/companies/${company.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-purple-200 transition"
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
