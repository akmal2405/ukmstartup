import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Camera, Pencil } from "lucide-react";
import { SentInterest, InterestStatus } from "@/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const STATUS_CONFIG: Record<InterestStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-gray-100 text-gray-600" },
  contacted: { label: "Contacted", className: "bg-blue-100 text-blue-700" },
  in_discussion: { label: "In Discussion", className: "bg-amber-100 text-amber-700" },
  declined: { label: "Declined", className: "bg-red-100 text-red-700" },
  closed: { label: "Closed", className: "bg-green-100 text-green-700" },
};

function StatusBadge({ status }: { status: InterestStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

const TABS = [
  { id: "about", label: "About" },
  { id: "sent", label: "My Interests" },
];

export default function IndustryProfile() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [editPicture, setEditPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editLocation, setEditLocation] = useState(user?.location || "");
  const [editCompanyName, setEditCompanyName] = useState(user?.companyName || "");
  const [editIndustry, setEditIndustry] = useState(user?.industry || "");
  const [editContactPerson, setEditContactPerson] = useState(user?.contactPerson || "");
  const [sentInterests, setSentInterests] = useState<SentInterest[]>([]);

  useEffect(() => {
    const fetchSentInterests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/interests/my-sent`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data: SentInterest[] = await res.json();
        setSentInterests(data);
      } catch (err) {
        console.error("Error fetching sent interests:", err);
      }
    };
    fetchSentInterests();
  }, []);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditPicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
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
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6 py-6 bg-white">

      {/* Header - static, no edit controls */}
      <section className="p-6 bg-white">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                className="w-full h-full object-cover"
              />
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

      {/* ── Tabs + content ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 px-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.id
                ? "border-[#D4609A] bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent"
                : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── Minat Saya tab ── */}
          {activeTab === "sent" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">My Interests</h2>
                <span className="text-sm font-semibold px-3 py-1 rounded-full  text-black">
                  Interest Sent: {sentInterests.length}
                </span>
              </div>

              {sentInterests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  You haven't expressed interest in any ideas yet.
                </div>
              ) : (
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[22%]">Idea</TableHead>
                      <TableHead className="w-[25%]">Message</TableHead>
                      <TableHead className="w-[12%]">Date</TableHead>
                      <TableHead className="w-[13%]">Status</TableHead>
                      <TableHead className="w-[28%]">Owner Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentInterests.map((interest) => (
                      <TableRow key={interest.id}>
                        <TableCell className="font-medium"><p className="truncate">{interest.ideaName}</p></TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {interest.message ? (
                            <p className="truncate max-w-[140px]" title={interest.message}>{interest.message}</p>
                          ) : (
                            <span className="text-slate-400 italic">No message.</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-400 whitespace-nowrap">
                          {new Date(interest.createdAt).toLocaleDateString("ms-MY")}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={interest.status} />
                        </TableCell>
                        <TableCell>
                          {interest.ownerEmail ? (
                            <a
                              href={`mailto:${interest.ownerEmail}`}
                              className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                            >
                              {interest.ownerEmail}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Awaiting response</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {/* Industry Information */}
          {activeTab === "about" && (
            <div>
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
                      className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Save
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
                      className="text-sm text-slate-500"
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
                    {previewUrl || user?.profilePicture ? (
                      <img
                        src={previewUrl || user?.profilePicture}
                        className="w-full h-30 object-cover"
                      />
                    ) : (
                      <span className="text-slate-400 text-xs">No logo</span>
                    )}
                    {isEditing && (
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePictureChange}
                        />
                      </label>
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
                      className="w-25 text-sm font-medium text-ate-900 border border-slate-200 rounded-lg px-3 py-1.5"
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
          )}

        </div>{/* closes <div className="p-6"> */}
      </div>{/* closes tabs container */}
    </div>
  );
}