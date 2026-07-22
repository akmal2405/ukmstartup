import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AiResultCard from "./aiResultCard";
import { ImagePlus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IdeaPreviewCard from "./ideaPreviewCard";

import { CATEGORIES, CATEGORY_LABELS } from "../../constants/categories";
const ALL_CATEGORIES = [...CATEGORIES, "Social"];

interface InitialData {
  startupName: string;
  category: string;
  phoneNumber?: string;
  shortDescription: string;
  logoUrl?: string;
  coverUrl?: string;
  hasEngagement?: boolean;
}

interface CreateIdeaFormProps {
  onSuccess?: () => void;
  ideaId?: string;
  initialData?: InitialData;
}

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

export default function CreateIdeaForm({ onSuccess, ideaId, initialData }: CreateIdeaFormProps) {
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startupName: "",
    category: "",
    phoneNumber: "",
    shortDescription: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ideaSubmitted, setIdeaSubmitted] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        startupName: initialData.startupName || "",
        category: initialData.category || "",
        phoneNumber: initialData.phoneNumber || "",
        shortDescription: initialData.shortDescription || "",
      });
      if (initialData.logoUrl) setLogoPreview(initialData.logoUrl);
      if (initialData.coverUrl) setCoverPreview(initialData.coverUrl);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (file: File | null, kind: "logo" | "cover") => {
    if (kind === "logo") {
      setLogoFile(file);
      setLogoPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setCoverFile(file);
      setCoverPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (ideaId && initialData?.hasEngagement) {
      const confirmed = confirm(
        "This idea already has community engagement (votes, comments, or interest). Editing will re-run the AI evaluation. Existing votes and comments will remain attached. Continue?"
      );
      if (!confirmed) return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append("startupName", formData.startupName);
    data.append("category", formData.category);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("shortDescription", formData.shortDescription);
    if (!ideaId) data.append("status", "draft");
    if (logoFile) data.append("logo", logoFile);
    if (coverFile) data.append("cover", coverFile);

    const token = localStorage.getItem("token");

    try {
      const url = ideaId
        ? `${import.meta.env.VITE_API_URL}/api/ideas/${ideaId}`
        : `${import.meta.env.VITE_API_URL}/api/ideas`;
      const method = ideaId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!response.ok) throw new Error(ideaId ? "Failed to update idea" : "Failed to submit idea");

      const ideaData = await response.json();

      if (ideaData.aiScore !== undefined && ideaData.aiScore !== null) {
        setAiResult({
          score: ideaData.aiScore,
          summary: ideaData.aiSummary,
          strengths: ideaData.aiStrengths || [],
          improvements: ideaData.aiImprovements || [],
          verdict: ideaData.aiVerdict,
          scores: ideaData.aiScores,
        });
      }

      setIdeaSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error(ideaId ? "Failed to update idea. Please try again." : "Failed to submit idea. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIdeaSubmitted(false);
    setAiResult(null);
    setFormData({ startupName: "", category: "", phoneNumber: "", shortDescription: "" });
    setLogoFile(null);
    setCoverFile(null);
    setLogoPreview(null);
    setCoverPreview(null);
    if (ideaId) {
      navigate(`/idea/${ideaId}`);
    }
  };

  if (ideaSubmitted) {
    return (
      <AiResultCard
        aiResult={aiResult}
        aiLoading={false}
        onReset={handleReset}
        logoPreview={logoPreview}
        coverPreview={coverPreview}
        formData={formData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">
            {ideaId ? "Edit Idea" : "Submit New Idea"}
          </h1>
          <p className="text-slate-500 text-sm">
            {ideaId
              ? "Update your startup idea details. The AI evaluation will re-run on save."
              : "Share your startup idea with the UKMStartUp community."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: form sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Basic Info */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <header className="mb-5">
                <h2 className="text-base font-semibold text-slate-900">Basic Information</h2>
                <p className="text-sm text-slate-500">Name, category, and how people can reach you.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="startupName">Startup Name</Label>
                  <Input
                    className="border-slate-300 placeholder:text-slate-500"
                    id="startupName"
                    name="startupName"
                    value={formData.startupName}
                    onChange={handleChange}
                    placeholder="cth: EduPath"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="border-slate-300 bg-white justify-between w-full" id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-300 bg-white" position="popper" side="bottom">
                      <SelectGroup>
                        {ALL_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    className="border-slate-300 placeholder:text-slate-500"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="012-3456789"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Branding */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <header className="mb-5">
                <h2 className="text-base font-semibold text-slate-900">Branding</h2>
                <p className="text-sm text-slate-500">Logo and cover image for your idea.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <label className="group relative flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50 transition cursor-pointer overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                    ) : (
                      <div className="text-center">
                        <ImagePlus className="w-7 h-7 text-slate-400 mx-auto mb-2 group-hover:text-indigo-500" />
                        <p className="text-sm font-medium text-slate-700">Upload logo</p>
                        <p className="text-xs text-slate-400">PNG, JPG · recommended 1:1</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null, "logo")}
                    />
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <label className="group relative flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50 transition cursor-pointer overflow-hidden">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2 group-hover:text-indigo-500" />
                        <p className="text-sm font-medium text-slate-700">Upload cover</p>
                        <p className="text-xs text-slate-400">PNG, JPG · recommended 16:9</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0] ?? null, "cover")}
                    />
                  </label>
                </div>
              </div>
            </section>

            {/* Section 3: Description */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <header className="mb-5">
                <h2 className="text-base font-semibold text-slate-900">Description</h2>
                <p className="text-sm text-slate-500">Describe your idea concisely and compellingly.</p>
              </header>
              <div className="space-y-2 border-slate-200 pt-4">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  className="border-slate-300 placeholder:text-slate-500"
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={6}
                  placeholder="What problem are you solving? For whom? Why does it matter?"
                  maxLength={280}
                  required
                />
                <div className="flex justify-end text-xs text-slate-400">
                  {formData.shortDescription.length}/280
                </div>
              </div>
            </section>
          </div>
          <IdeaPreviewCard
            formData={formData}
            logoPreview={logoPreview}
            coverPreview={coverPreview}
            isLoading={isLoading}
            showSubmitBar={true}
            submitLabel={ideaId ? "Save Changes" : undefined}
          />
        </form>
      </main>
    </div>
  );
}
