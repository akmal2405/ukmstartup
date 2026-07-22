import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Camera, Pencil } from "lucide-react";

export default function IndustryProfile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editPicture, setEditPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState(user?.location || "");
  const [editCompanyName, setEditCompanyName] = useState(user?.companyName || "");
  const [editIndustry, setEditIndustry] = useState(user?.industry || "");
  const [editContactPerson, setEditContactPerson] = useState(user?.contactPerson || "");
  const [pictureLoaded, setPictureLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const displayPicture = previewUrl || user?.profilePicture;

  useEffect(() => {
    setPictureLoaded(false);
    setLogoLoaded(false);
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
      formData.append("location", editLocation);
      formData.append("companyName", editCompanyName);
      formData.append("industry", editIndustry);
      formData.append("contactPerson", editContactPerson);
      if (editPicture) formData.append("profilePicture", editPicture);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setUser(data.user);
      setIsEditing(false);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
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
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {user?.contactPerson || "User"}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Joined 2025</p>
            </div>
          </div>
        </section>

        {/* Industry Information */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Industry Information</h2>
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
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewUrl(null);
                      setEditLocation(user?.location || "");
                      setEditCompanyName(user?.companyName || "");
                      setEditIndustry(user?.industry || "");
                      setEditContactPerson(user?.contactPerson || "");
                    }}
                    disabled={isSaving}
                    className="text-sm text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-8 mb-5">
              {/* Left - Company Logo */}
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">Company Logo</p>
                <div className="w-40 h-40 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                  {displayPicture ? (
                    <>
                      {!logoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                          <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                        </div>
                      )}
                      <img
                        src={displayPicture}
                        onLoad={() => setLogoLoaded(true)}
                        onError={() => setLogoLoaded(true)}
                        className={`w-full h-30 object-cover transition-opacity ${logoLoaded ? "opacity-100" : "opacity-0"}`}
                      />
                    </>
                  ) : (
                    <span className="text-slate-400 text-xs">No logo</span>
                  )}
                  {isSaving ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    isEditing && (
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
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
              </div>

              {/* Right - Location + Map */}
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">Company HQ Location</p>
                {isEditing ? (
                  <input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. Kuala Lumpur, Malaysia"
                    className="w-full text-sm font-medium text-slate-900 border border-slate-200 rounded-lg px-3 py-2 mb-2"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 mb-2">
                    {user?.location || "—"}
                  </p>
                )}

                {user?.location && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 h-full">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(user.location)}&output=embed`}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex gap-3 items-center">
                <span className="text-slate-400 w-32 flex-shrink-0">Company Name</span>
                {isEditing ? (
                  <input
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="w-25 text-sm font-medium text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5"
                  />
                ) : (
                  <span className="font-medium text-slate-900">{user?.companyName || "—"}</span>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-slate-400 w-32 flex-shrink-0">Industry Type</span>
                {isEditing ? (
                  <input
                    value={editIndustry}
                    onChange={(e) => setEditIndustry(e.target.value)}
                    className="w-25 text-sm font-medium text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5"
                  />
                ) : (
                  <span className="font-medium text-slate-900">{user?.industry || "—"}</span>
                )}
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-slate-400 w-32 flex-shrink-0">Contact Person</span>
                {isEditing ? (
                  <input
                    value={editContactPerson}
                    onChange={(e) => setEditContactPerson(e.target.value)}
                    className="w-25 text-sm font-medium text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5"
                  />
                ) : (
                  <span className="font-medium text-slate-900">{user?.contactPerson || "—"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
