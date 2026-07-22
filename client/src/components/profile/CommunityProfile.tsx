import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Pencil, Camera } from "lucide-react";

export default function CommunityProfile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editPicture, setEditPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pictureLoaded, setPictureLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const displayPicture = previewUrl || user?.profilePicture;

  useEffect(() => {
    setPictureLoaded(false);
  }, [displayPicture]);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditPicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fullName", editName);
      formData.append("email", editEmail);
      if (editPicture) formData.append("profilePicture", editPicture);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to update profile");
      }

      const data = await res.json();
      setUser(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err instanceof Error ? err.message : err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── Profile Header ── */}
        <section className="p-6 bg-white">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden relative">
              {displayPicture ? (
                <>
                  {!pictureLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={displayPicture}
                    onLoad={() => setPictureLoaded(true)}
                    onError={() => setPictureLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity ${pictureLoaded ? "opacity-100" : "opacity-0"}`}
                  />
                </>
              ) : (
                user?.fullName?.charAt(0)?.toUpperCase() || "U"
              )}
              {isSaving ? (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer rounded-full">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePictureChange}
                    />
                  </label>
                )
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {user?.fullName || "User"}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5 capitalize">
                {user?.communityRole}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Joined 2025</p>
            </div>
          </div>
        </section>

        {/* ── About ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">About</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSaving && (
                      <div className="w-3.5 h-3.5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="text-sm text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-3 items-center">
                <span className="text-slate-400 w-24 flex-shrink-0">Name</span>
                {isEditing ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 font-medium text-slate-900 "
                  />
                ) : (
                  <span className="font-medium text-slate-900">{user?.fullName || "—"}</span>
                )}
              </div>

              <div className="flex gap-3 items-center">
                <span className="text-slate-400 w-24 flex-shrink-0">Email</span>
                {isEditing ? (
                  <input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="flex-1 font-medium text-slate-900"
                  />
                ) : (
                  <span className="font-medium text-slate-900">{user?.email || "—"}</span>
                )}
              </div>

              <div className="flex gap-3">
                <span className="text-slate-400 w-24 flex-shrink-0">Role</span>
                <span className="font-medium text-slate-900 capitalize">
                  {user?.communityRole || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}