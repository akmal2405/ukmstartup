import { useNavigate } from "react-router-dom";
import CreateIdeaForm from "../components/ideas/CreateIdeaForm";

export default function CreateIdea() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-white py-10">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1 transition"
          >
            ← Kembali ke Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900">Cipta Idea Baru</h1>
          <p className="text-slate-500 mt-1">Kongsi idea startup anda dengan komuniti UKM.</p>
        </div>

        {/* Form */}
        <CreateIdeaForm onSuccess={() => navigate("/dashboard")} />

      </div>
    </section>
  );
}