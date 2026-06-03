import { ArrowBigDown, ArrowBigUp, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";


interface IdeaPreviewCardProps {
  formData: {
    startupName: string;
    category: string;
    shortDescription: string;
  };
  logoPreview: string | null;
  coverPreview: string | null;
  isLoading: boolean;
  showSubmitBar?: boolean;
}




export default function IdeaPreviewCard({ formData, logoPreview, coverPreview, isLoading, showSubmitBar }: IdeaPreviewCardProps) {
  const navigate = useNavigate();
  const initials = formData.startupName
    ? formData.startupName.slice(0, 2).toUpperCase()
    : "??";

  return (
    <aside className="lg:col-span-1">
      <div className="lg:sticky lg:top-24 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Sparkles className="w-4 h-4 text-indigo-600" /> LIVE REVIEW
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="relative aspect-[16/9] bg-gradient-to-br from-indigo-100 to-violet-100">
            {coverPreview && (
              <img src={coverPreview} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}
            {formData.category && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-slate-700 backdrop-blur">
                {formData.category}
              </span>
            )}
            <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-full ring-4 ring-white bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <span></span>
              )}
            </div>
          </div>
          <div className="p-4 pt-8">
            <h3 className="font-semibold text-slate-900 truncate">
              {formData.startupName || "Nama Startup Anda"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">oleh Anda</p>
            <p className="text-sm text-slate-600 mt-3 line-clamp-3 min-h-[3.75rem]">
              {formData.shortDescription || "Penerangan idea anda akan dipaparkan di sini..."}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                <ArrowBigUp className="w-3.5 h-3.5" /> 0
                <span className="mx-1 text-slate-300">·</span>
                <ArrowBigDown className="w-3.5 h-3.5" /> 0
              </div>
              <div className="inline-flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> 0
              </div>
            </div>
          </div>
          {showSubmitBar && (
            <div className="lg:col-span-3 bottom-4 z-10">
              <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-3 flex items-center justify-between">
                <p className="text-sm text-slate-500 hidden sm:block px-2">
                  Pastikan semua maklumat tepat sebelum hantar.
                </p>
                <div className="flex items-center gap-2 ml-auto">
                  <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6"
                  >
                    {isLoading ? "Menghantar..." : "Hantar Idea"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}




