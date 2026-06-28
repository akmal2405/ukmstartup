import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Building2, MapPin, Phone, User, Briefcase } from "lucide-react";

interface CompanyDetail {
  id: string;
  companyName: string;
  industry: string | null;
  location: string | null;
  contactPerson: string | null;
  phone: string | null;
  profilePicture: string | null;
  createdAt: string;
  interestCount: number;
}

export default function CompanyProfile() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/companies/${id}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => { if (data) setCompany(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (notFound || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Building2 className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-base font-medium">Company not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
          {company.profilePicture ? (
            <img
              src={company.profilePicture}
              alt={company.companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-9 h-9 text-slate-400" />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">{company.companyName}</h1>
          {company.industry && (
            <span className="mt-2 inline-block px-3 py-0.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
              {company.industry}
            </span>
          )}
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500 flex-wrap justify-center">
          {company.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {company.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-slate-400" />
            {company.interestCount} {Number(company.interestCount) === 1 ? "idea" : "ideas"} interested in
          </span>
        </div>
      </div>

      {/* Details card */}
      {(company.contactPerson || company.phone) && (
        <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Contact</h2>
          {company.contactPerson && (
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{company.contactPerson}</span>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{company.phone}</span>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-xs text-slate-400 mt-6">
        Member since {new Date(company.createdAt).toLocaleDateString("en-MY", { month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
