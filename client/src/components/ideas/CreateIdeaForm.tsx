import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
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

const CATEGORIES = ["Teknologi", "Perniagaan", "Pendidikan", "Kesihatan", "Kewangan", "Sosial"];

interface CreateIdeaFormProps {
  onSuccess?: () => void;
}

interface AiResult {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  verdict: string;
}

export default function CreateIdeaForm({ onSuccess }: CreateIdeaFormProps) {
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
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
    setIsLoading(true);

    const data = new FormData();
    data.append("startupName", formData.startupName);
    data.append("category", formData.category);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("shortDescription", formData.shortDescription);
    data.append("status", "draft");
    if (logoFile) data.append("logo", logoFile);
    if (coverFile) data.append("cover", coverFile);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!response.ok) throw new Error("Failed to submit idea");

      setIdeaSubmitted(true);
      setIsLoading(false);

      // 2. Call AI evaluator
      setAiLoading(true);
      const aiRes = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startupName: formData.startupName,
          category: formData.category,
          shortDescription: formData.shortDescription,
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        setAiResult(aiData);
      }

    } catch (error) {
      console.error(error);
      alert("Gagal menghantar idea. Cuba lagi.");
    } finally {
      setIsLoading(false);
      setAiLoading(false);
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
  };


  if (ideaSubmitted) {
    return (
      <AiResultCard
        aiResult={aiResult}
        aiLoading={aiLoading}
        onReset={handleReset}
        logoPreview={logoPreview}
        coverPreview={coverPreview}
        formData={formData}

      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hantar Idea Baru</h1>
          <p className="text-slate-500 mt-1">
            Kongsi idea startup anda dengan komuniti UKMStartUp.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Info */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <header className="mb-5">
              <h2 className="text-base font-semibold text-slate-900">Maklumat Asas</h2>
              <p className="text-sm text-slate-500">Nama, kategori, dan cara orang boleh hubungi anda.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="startupName">Nama Startup</Label>
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
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="border-slate-300 bg-white justify-between w-full" id="category">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-300 bg-white" position="popper" side="bottom">
                    <SelectGroup>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nombor Telefon</Label>
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
              <h2 className="text-base font-semibold text-slate-900">Penjenamaan</h2>
              <p className="text-sm text-slate-500">Logo dan gambar muka depan untuk idea anda.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loga</Label>
                <label className="group relative flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50 transition cursor-pointer overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="w-7 h-7 text-slate-400 mx-auto mb-2 group-hover:text-indigo-500" />
                      <p className="text-sm font-medium text-slate-700">Muat naik logo</p>
                      <p className="text-xs text-slate-400">PNG, JPG · disyorkan 1:1</p>
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
                <Label>Gambar Muka Depan</Label>
                <label className="group relative flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50 transition cursor-pointer overflow-hidden">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2 group-hover:text-indigo-500" />
                      <p className="text-sm font-medium text-slate-700">Muat naik kover</p>
                      <p className="text-xs text-slate-400">PNG, JPG · disyorkan 16:9</p>
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
              <h2 className="text-base font-semibold text-slate-900">Penerangan</h2>
              <p className="text-sm text-slate-500">Terangkan idea anda secara ringkas dan menarik.</p>
            </header>
            <div className="space-y-2 border-slate-200 pt-4">
              <Label htmlFor="shortDescription">Penerangan Ringkas</Label>
              <Textarea
                className="border-slate-300 placeholder:text-slate-500"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={6}
                placeholder="Apa masalah yang anda selesaikan? Untuk siapa? Mengapa ia penting?"
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
        />
      </form>
    </div>
  );
}