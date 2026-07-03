import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/ideas/CommentSection";
import VotePill from "../components/ideas/VotePill";
import { Idea } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, FileText, Video, Trash2, Minus, ArrowBigUp, ArrowBigDown, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORY_LABELS } from "../constants/categories";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

export default function PitchDeck() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Single dialog, two modes
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editMode, setEditMode] = useState<"choose" | "section" | "materials" | "delete">("choose");
  const [deletingItem, setDeletingItem] = useState<string | null>(null);

  const [newTabTitle, setNewTabTitle] = useState("");
  const [newTabContent, setNewTabContent] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [slidesFile, setSlidesFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [isSavingMaterials, setIsSavingMaterials] = useState(false);
  const [related, setRelated] = useState([]);
  const [galleryApi, setGalleryApi] = useState<CarouselApi>();
  const [galleryCurrent, setGalleryCurrent] = useState(0);

  useEffect(() => {
    if (!galleryApi) return;
    setGalleryCurrent(galleryApi.selectedScrollSnap());
    galleryApi.on("select", () => {
      setGalleryCurrent(galleryApi.selectedScrollSnap());
    });
  }, [galleryApi]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/related`)
      .then(r => r.json())
      .then(setRelated);
  }, [id]);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}`);
        const data: Idea = await res.json();
        setIdea(data);
        setYoutubeUrl(data.youtubeUrl || "");
      } catch (err) {
        console.error("Error fetching idea:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id]);

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/tabs`);
        const data: any[] = await res.json();
        setTabs(data);
      } catch (err) {
        console.error("Error fetching tabs:", err);
      }
    };
    fetchTabs();
  }, [id]);

  const closeDialog = () => {
    setShowEditDialog(false);
    setEditMode("choose");
  };

  const handleAddTab = async () => {
    if (!newTabTitle.trim() || isSavingSection) return;
    setIsSavingSection(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/tabs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTabTitle, content: newTabContent }),
      });
      const newTab = await res.json();
      setTabs([...tabs, newTab]);
      setNewTabTitle("");
      setNewTabContent("");
      closeDialog();
    } catch (err) {
      console.error("Error creating tab:", err);
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleDeleteTab = async (tabId: number) => {
    setDeletingItem(`tab-${tabId}`);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${id}/tabs/${tabId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.ok) {
        setTabs((prev) => prev.filter((t) => t.id !== tabId));
        if (activeTab === String(tabId)) setActiveTab("overview");
      }
    } finally {
      setDeletingItem(null);
    }
  };

  const handleClearField = async (field: "youtube_url" | "slides_url" | "gallery_image_urls") => {
    setDeletingItem(field);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ideas/${id}/pitch/clear`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ field }),
        },
      );
      if (res.ok) {
        setIdea((prev) =>
          prev
            ? {
              ...prev,
              youtubeUrl: field === "youtube_url" ? undefined : prev.youtubeUrl,
              slidesUrl: field === "slides_url" ? undefined : prev.slidesUrl,
              galleryImageUrls: field === "gallery_image_urls" ? [] : prev.galleryImageUrls,
            }
            : prev,
        );
        if (field === "youtube_url") setYoutubeUrl("");
      }
    } finally {
      setDeletingItem(null);
    }
  };

  const handleSaveOverview = async () => {
    if (isSavingMaterials) return;
    setIsSavingMaterials(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("youtube_url", youtubeUrl);
      if (slidesFile) formData.append("slides", slidesFile);
      galleryFiles.forEach((f) => formData.append("galleryImages", f));
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/pitch`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const updated: Idea = await res.json();
      setIdea(updated);
      closeDialog();
    } catch (err) {
      console.error("Error saving overview:", err);
    } finally {
      setIsSavingMaterials(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );

  if (!idea)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Idea not found.</p>
      </div>
    );

  const isOwner = user?.id === idea?.userId;

  const youtubeEmbedUrl = (() => {
    if (!idea.youtubeUrl) return null;
    const m = idea.youtubeUrl.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : idea.youtubeUrl;
  })();

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left side */}
          <div className="flex flex-col gap-8 lg:flex-1 min-w-0">

            {/* Header */}
            <div className="flex items-start gap-4">
              {idea.logoUrl ? (
                <img
                  src={idea.logoUrl!}
                  alt={idea.startupName}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-gray-500">
                    {idea.startupName?.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-900">{idea.startupName}</h1>
                <p className="text-sm text-slate-600 mt-1">{idea.shortDescription}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-blue-600 uppercase font-semibold">{idea.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-400">by {idea.ownerName}</span>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex flex-col">
              <div className="flex items-center border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "overview"
                    ? "border-[#D4609A] text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                >
                  Overview
                </button>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(String(tab.id))}
                    className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === String(tab.id)
                      ? "border-[#D4609A] text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {tab.title}
                  </button>
                ))}
                {isOwner && (
                  <button
                    onClick={() => setShowEditDialog(true)}
                    className="ml-auto inline-flex items-center gap-1 px-3 py-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit Pitch Deck
                  </button>
                )}
              </div>

              {/* Tab content */}
              <div className="py-6">
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-6">
                    {youtubeEmbedUrl && (
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 bg-black">
                        <iframe
                          src={youtubeEmbedUrl}
                          title="Pitch video"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {idea.slidesUrl && (
                      <div className="w-full h-[28rem] rounded-xl overflow-hidden border border-slate-200">
                        <iframe src={idea.slidesUrl!} title="Pitch slides" className="w-full h-full" />
                      </div>
                    )}
                    {idea.galleryImageUrls && idea.galleryImageUrls.length > 0 && (
                      <div className="relative w-full rounded-xl overflow-hidden">
                        <Carousel className="w-full" setApi={setGalleryApi}>
                          <CarouselContent>
                            {idea.galleryImageUrls.map((url, index) => (
                              <CarouselItem key={index}>
                                <div className="aspect-video w-full overflow-hidden rounded-xl">
                                  <img
                                    src={url}
                                    alt={`${idea.startupName} image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-3 h-8 w-8 border-0 bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm" />
                          <CarouselNext className="right-3 h-8 w-8 border-0 bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm" />
                        </Carousel>
                        {idea.galleryImageUrls.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                            {idea.galleryImageUrls.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => galleryApi?.scrollTo(index)}
                                className={`h-1.5 rounded-full transition-all ${
                                  index === galleryCurrent
                                    ? "w-4 bg-white"
                                    : "w-1.5 bg-white/50 hover:bg-white/70"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {idea.shortDescription && (
                      <p className="text-slate-600 leading-relaxed">{idea.shortDescription}</p>
                    )}
                  </div>
                )}

                {tabs.map(tab =>
                  activeTab === String(tab.id) ? (
                    <p key={tab.id} className="text-slate-600 break-words whitespace-pre-wrap leading-relaxed">
                      {tab.content}
                    </p>
                  ) : null
                )}
              </div>
            </div>

            {/* Comments */}
            <CommentSection ideaId={id!} />
          </div>

          {/* Right side */}
          <aside className="lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-20 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Idea Stats</h3>
                <div className="space-y-4">
                  <VotePill ideaId={idea.id} commentCount={idea.commentCount} />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">About the Founder</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0">
                    {idea.ownerProfilePicture ? (
                      <img src={idea.ownerProfilePicture} className="w-full h-full object-cover" />
                    ) : (
                      idea.ownerName?.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{idea.ownerName}</p>
                    {idea.ownerCommunityRole && (
                      <p className="text-xs text-slate-400 capitalize">{idea.ownerCommunityRole}</p>
                    )}
                  </div>
                </div>
                {idea.ownerFaculty && (
                  <p className="text-sm text-slate-600">{idea.ownerFaculty}</p>
                )}
                {idea.ownerYearOfStudy && (
                  <p className="text-sm text-slate-400 mt-0.5">Year {idea.ownerYearOfStudy}</p>
                )}
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Similar Startup Ideas</h3>
                <div className="flex flex-col divide-y divide-slate-100">
                  {related.map(idea => (
                    <Link to={`/idea/${idea.id}`} key={idea.id} className="flex gap-3 py-4 hover:bg-slate-50 transition rounded-lg px-2 -mx-2">
                      <img
                        src={idea.logoUrl ?? "https://placehold.co/100x100"}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{idea.startupName}</p>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-0.5">{idea.shortDescription}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-600">
                            {CATEGORY_LABELS[idea.category] ?? idea.category}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="flex items-center gap-0.5">
                              <ArrowBigUp className="w-3.5 h-3.5" />{idea.upvoteCount}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <ArrowBigDown className="w-3.5 h-3.5" />{idea.downvoteCount}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <MessageCircle className="w-3 h-3" />{idea.commentCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Edit Pitch Deck Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="bg-white rounded-lg p-6">
          {editMode === "choose" && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Pitch Deck</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-3 mt-2">
                <button
                  onClick={() => setEditMode("section")}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Add Section</p>
                    <p className="text-xs text-slate-500">Add a custom section (e.g. Q&A, Roadmap)</p>
                  </div>
                </button>
                <button
                  onClick={() => setEditMode("materials")}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Pitch Materials</p>
                    <p className="text-xs text-slate-500">Update YouTube video or slides (PDF)</p>
                  </div>
                </button>
                <button
                  onClick={() => setEditMode("delete")}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-4.5 h-4.5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Delete Content</p>
                    <p className="text-xs text-slate-500">Remove sections, video, or slides</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {editMode === "section" && (
            <>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                <Input
                  placeholder="Section title (e.g. Q&A, Roadmap)"
                  value={newTabTitle}
                  onChange={(e) => setNewTabTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Section content..."
                  value={newTabContent}
                  onChange={(e) => setNewTabContent(e.target.value)}
                  rows={5}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddTab}
                    disabled={isSavingSection}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
                  >
                    {isSavingSection ? "Saving..." : "Save Section"}
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode("choose")} disabled={isSavingSection}>
                    Back
                  </Button>
                </div>
              </div>
            </>
          )}

          {editMode === "delete" && (
            <>
              <DialogHeader>
                <DialogTitle>Delete Content</DialogTitle>
              </DialogHeader>
              <div className="mt-2 space-y-1">
                {tabs.length === 0 && !idea.youtubeUrl && !idea.slidesUrl && !idea.galleryImageUrls?.length && (
                  <p className="text-sm text-slate-400 py-4 text-center">Nothing to delete.</p>
                )}
                {tabs.map((tab) => (
                  <div key={tab.id} className="flex items-center justify-between py-2 px-1 border-b border-slate-100">
                    <span className="text-sm text-slate-700">{tab.title}</span>
                    <button
                      onClick={() => handleDeleteTab(tab.id)}
                      disabled={deletingItem === `tab-${tab.id}`}
                      className="flex items-center justify-center w-6 h-6 rounded-full border border-red-200 text-red-400 hover:bg-red-50 disabled:opacity-40 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {idea.youtubeUrl && (
                  <div className="flex items-center justify-between py-2 px-1 border-b border-slate-100">
                    <span className="text-sm text-slate-700">YouTube Video</span>
                    <button
                      onClick={() => handleClearField("youtube_url")}
                      disabled={deletingItem === "youtube_url"}
                      className="flex items-center justify-center w-6 h-6 rounded-full border border-red-200 text-red-400 hover:bg-red-50 disabled:opacity-40 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {idea.slidesUrl && (
                  <div className="flex items-center justify-between py-2 px-1 border-b border-slate-100">
                    <span className="text-sm text-slate-700">PDF Slides</span>
                    <button
                      onClick={() => handleClearField("slides_url")}
                      disabled={deletingItem === "slides_url"}
                      className="flex items-center justify-center w-6 h-6 rounded-full border border-red-200 text-red-400 hover:bg-red-50 disabled:opacity-40 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                {idea.galleryImageUrls && idea.galleryImageUrls.length > 0 && (
                  <div className="flex items-center justify-between py-2 px-1">
                    <span className="text-sm text-slate-700">Gallery Images ({idea.galleryImageUrls.length})</span>
                    <button
                      onClick={() => handleClearField("gallery_image_urls")}
                      disabled={deletingItem === "gallery_image_urls"}
                      className="flex items-center justify-center w-6 h-6 rounded-full border border-red-200 text-red-400 hover:bg-red-50 disabled:opacity-40 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <Button variant="outline" className="mt-3 w-full" onClick={() => setEditMode("choose")}>
                Back
              </Button>
            </>
          )}

          {editMode === "materials" && (
            <>
              <DialogHeader>
                <DialogTitle>Pitch Materials</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-sm font-medium text-slate-600">YouTube URL</label>
                  <Input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Upload Slides (PDF)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSlidesFile(e.target.files?.[0] || null)}
                    className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Gallery Images (up to 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setGalleryFiles(Array.from(e.target.files || []).slice(0, 5))}
                    className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {galleryFiles.length > 0 && (
                    <p className="mt-1 text-xs text-slate-400">{galleryFiles.length} image{galleryFiles.length > 1 ? "s" : ""} selected</p>
                  )}
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleSaveOverview}
                    disabled={isSavingMaterials}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
                  >
                    {isSavingMaterials ? "Uploading..." : "Save"}
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode("choose")} disabled={isSavingMaterials}>
                    Back
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}