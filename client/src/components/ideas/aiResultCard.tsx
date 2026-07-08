import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import IdeaPreviewCard from "./ideaPreviewCard";

interface AiResult {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  verdict: string;
  scores?: {
    keaslian: number;
    kebolehlaksanaan: number;
    saizPasaran: number;
    kejelasanMasalah: number;
  };
}

interface AiResultCardProps {
  onReset: () => void;
  aiResult: AiResult | null;
  aiLoading: boolean;
  formData?: {
    startupName: string;
    category: string;
    shortDescription: string;
  };
  logoPreview?: string | null;
  coverPreview?: string | null;
}

export default function AiResultCard({ aiResult, aiLoading, onReset, formData, logoPreview, coverPreview }: AiResultCardProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Idea Submitted Successfully!</h2>
        <p className="text-slate-500 mt-2">AI is evaluating your idea...</p>
      </div>

      {aiLoading && (
        <div className="p-6 bg-indigo-50 rounded-xl text-center border border-indigo-100">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-indigo-600 font-medium">AI is evaluating your idea...</p>
          <p className="text-xs text-indigo-400 mt-1">This takes about 5–10 seconds</p>
        </div>
      )}

      {aiResult && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <IdeaPreviewCard
            formData={formData!}
            logoPreview={logoPreview!}
            coverPreview={coverPreview!}
            isLoading={false}
          />
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">AI Evaluation</h3>
              </div>
              <span className={`text-lg font-black px-4 py-1.5 rounded-full ${aiResult.score >= 7 ? "bg-emerald-50 text-emerald-700" :
                aiResult.score >= 5 ? "bg-amber-50 text-amber-700" :
                  "bg-red-50 text-red-700"
                }`}>
                {aiResult.score}/10
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* Summary */}
              <p className="text-sm text-slate-600 leading-relaxed">{aiResult.summary}</p>

              {/* Score Breakdown */}
              {aiResult.scores && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Score Breakdown
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Keaslian</p>
                      <p className="text-lg font-bold text-slate-900">{aiResult.scores.keaslian}/10</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Kebolehlaksanaan</p>
                      <p className="text-lg font-bold text-slate-900">{aiResult.scores.kebolehlaksanaan}/10</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Saiz Pasaran</p>
                      <p className="text-lg font-bold text-slate-900">{aiResult.scores.saizPasaran}/10</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Kejelasan Masalah</p>
                      <p className="text-lg font-bold text-slate-900">{aiResult.scores.kejelasanMasalah}/10</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Strengths */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Strengths
                </p>
                <ul className="space-y-2">
                  {aiResult.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Improvement Suggestions
                </p>
                <ul className="space-y-2">
                  {aiResult.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">→</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verdict */}
              <div className={`text-center py-3 px-4 rounded-xl text-sm font-bold ${aiResult.verdict === "Berpotensi Tinggi" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                aiResult.verdict === "Berpotensi Sederhana" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  "bg-red-50 text-red-700 border border-red-200"
                }`}>
                {aiResult.verdict === "Berpotensi Tinggi" ? "" :
                  aiResult.verdict === "Berpotensi Sederhana" ? "" : ""} {aiResult.verdict}
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
                onClick={() => {
                  navigate("/dashboard"); onReset()
                }}
              >
                Submit Another Idea
              </Button>
            </div>
          </div>
        </div>
      )}
      {!aiLoading && !aiResult && (
        <div className="p-6 bg-yellow-50 rounded-xl text-center border border-yellow-100">
          <p className="text-sm text-yellow-600 font-medium">No AI result to display.</p>
        </div>
      )}
    </div>
  );
}