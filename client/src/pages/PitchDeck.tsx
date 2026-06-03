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
import { Plus, Pencil } from "lucide-react";

export default function PitchDeck() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTab, setShowAddTab] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState("");
  const [newTabContent, setNewTabContent] = useState("");
  const [editingOverview, setEditingOverview] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [slidesFile, setSlidesFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}`);
        const data: Idea = await res.json();
        setIdea(data);
        setYoutubeUrl(data.youtube_url || "");
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

  const handleAddTab = async () => {
    if (!newTabTitle.trim()) return;
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
      setShowAddTab(false);
    } catch (err) {
      console.error("Error creating tab:", err);
    }
  };

  const handleSaveOverview = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("youtube_url", youtubeUrl);
      if (slidesFile) formData.append("slides", slidesFile);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}/pitch`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const updated: Idea = await res.json();
      setIdea(updated);
      setEditingOverview(false);
    } catch (err) {
      console.error("Error saving overview:", err);
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

  const isOwner = user?.id === idea?.user_id;

  const youtubeEmbedUrl = (() => {
    if (!idea.youtube_url) return null;
    const m = idea.youtube_url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : idea.youtube_url;
  })();

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left side */}
          <div className="flex flex-col gap-8 lg:flex-1 min-w-0">

            {/* Header */}
            <div className="flex items-start gap-4">
              {idea.logo_url ? (
                <img
                  src={`http://localhost:5000${idea.logo_url}`}
                  alt={idea.startup_name}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-gray-500">
                    {idea.startup_name?.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900">{idea.startup_name}</h1>
                <p className="text-gray-500 text-sm mt-1">{idea.short_description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-blue-600 uppercase font-semibold">{idea.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">by {idea.owner_name}</span>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex flex-col">
              <div className="flex items-center border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "overview"
                    ? "border-indigo-600 text-slate-900"
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
                      ? "border-indigo-600 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    {tab.title}
                  </button>
                ))}
                {isOwner && (
                  <button
                    onClick={() => setShowAddTab(true)}
                    className="ml-auto inline-flex items-center gap-1 px-3 py-3 text-sm text-slate-500 hover:text-indigo-600"
                  >
                    <Plus className="h-4 w-4" /> Add Section
                  </button>
                )}
              </div>

              {/* Tab content */}
              <div className="py-6">
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-6">
                    {isOwner && !editingOverview && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => setEditingOverview(true)}
                          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit Pitch Deck
                        </button>
                      </div>
                    )}
                    {editingOverview ? (
                      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                        <div>
                          <label className="text-sm font-medium text-slate-700">YouTube URL</label>
                          <Input
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="mt-1 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700">Upload Slides (PDF)</label>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setSlidesFile(e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button onClick={handleSaveOverview} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save</Button>
                          <Button variant="outline" onClick={() => setEditingOverview(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {idea.cover_image_url && (
                          <img
                            src={`http://localhost:5000${idea.cover_image_url}`}
                            alt={idea.startup_name}
                            className="w-full rounded-xl border border-slate-200 object-cover"
                          />
                        )}
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
                        {idea.slides_url && (
                          <div className="w-full h-[28rem] rounded-xl overflow-hidden border border-slate-200">
                            <iframe src={`http://localhost:5000${idea.slides_url}`} title="Pitch slides" className="w-full h-full" />
                          </div>
                        )}
                        {idea.short_description && (
                          <p className="text-slate-600 leading-relaxed">{idea.short_description}</p>
                        )}
                      </>
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
                <h3 className="font-semibold text-slate-900 mb-4">Idea Stats</h3>
                <div className="space-y-4">
                  <VotePill ideaId={idea.id} commentCount={idea.comment_count} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div >

      {/* Dialog */}
      < Dialog open={showAddTab} onOpenChange={setShowAddTab} >
        <DialogContent className="space-y-4 mt-2 bg bg-white rounded-lg p-4">
          <DialogHeader>
            <DialogTitle>Add New Section</DialogTitle>
          </DialogHeader>
          <div>
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
            <Button onClick={handleAddTab} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Save Section
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}