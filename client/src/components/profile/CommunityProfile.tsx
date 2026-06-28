import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Interest, InterestStatus } from "../../types";
import { Pencil, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STATUS_TRIGGER_CLASS: Record<InterestStatus, string> = {
  pending: "bg-gray-100 text-gray-600 border-gray-200",
  contacted: "bg-blue-100 text-blue-700 border-blue-200",
  in_discussion: "bg-amber-100 text-amber-700 border-amber-200",
  declined: "bg-red-100 text-red-700 border-red-200",
  closed: "bg-green-100 text-green-700 border-green-200",
};

const TABS = [
  { id: "about", label: "About" },
  { id: "interest", label: "Industry Interest" },
];

export default function CommunityProfile() {
  const [activeTab, setActiveTab] = useState("about");
  const { user, setUser } = useAuth();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editPicture, setEditPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    }
  };

  useEffect(() => {
    const fetchMyInterests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/interests/my-interests`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data: Interest[] = await res.json();
        setInterests(data);
      } catch (err) {
        console.error("Error fetching interests:", err);
      }
    };
    fetchMyInterests();
  }, []);

  const updateStatus = async (interestId: string, status: InterestStatus) => {
    setInterests((prev) =>
      prev.map((i) => (i.id === interestId ? { ...i, status } : i))
    );
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/api/interests/${interestId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error("Error updating interest status:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6 py-6 bg-white">

      {/* ── Profile Header ── */}
      <section className="p-6 bg-white">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden relative">
            {previewUrl || user?.profilePicture ? (
              <img
                src={previewUrl || user?.profilePicture}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.fullName?.charAt(0)?.toUpperCase() || "U"
            )}
            {isEditing && (
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer rounded-full">
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

      {/* ── Tabs ── */}
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

          {/* ── Tentang ── */}
          {activeTab === "about" && (
            <div>
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
                      className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-sm text-slate-500"
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
          )}

          {/* ── Minat Industri ── */}
          {activeTab === "interest" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900">Industry Interest</h2>
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  {interests?.length || 0} companies
                </span>
              </div>

              {interests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No companies have shown interest yet.
                </div>
              ) : (
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[22%]">Company</TableHead>
                      <TableHead className="w-[12%]">Industry</TableHead>
                      <TableHead className="w-[22%]">Message</TableHead>
                      <TableHead className="w-[10%]">Date</TableHead>
                      <TableHead className="w-[22%]">Status</TableHead>
                      <TableHead className="w-[12%] text-right">Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interests.map((interest) => (
                      <TableRow key={interest.id}>
                        <TableCell className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {interest.profilePicture ? (
                              <img
                                src={interest.profilePicture}
                                alt={interest.companyName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              interest.companyName?.charAt(0)
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/companies/${interest.companyId}`}
                              className="font-medium text-sm truncate hover:underline text-slate-900"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {interest.companyName}
                            </Link>
                            <p className="text-xs text-slate-400 truncate">{interest.ideaName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {interest.industry}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {interest.message ? (
                            <p className="truncate max-w-[140px]" title={interest.message}>
                              {interest.message}
                            </p>
                          ) : (
                            <span className="text-slate-400 italic">No message.</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-400 whitespace-nowrap">
                          {new Date(interest.createdAt).toLocaleDateString("ms-MY")}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={interest.status}
                            onValueChange={(val) => updateStatus(interest.id, val as InterestStatus)}
                          >
                            <SelectTrigger
                              className={`h-7 text-xs font-medium rounded-full px-3 border w-fit gap-1.5 ${STATUS_TRIGGER_CLASS[interest.status ?? "pending"]}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Accept</SelectItem>
                              <SelectItem value="in_discussion">In Discussion</SelectItem>
                              <SelectItem value="declined">Decline</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          {!["declined", "closed"].includes(interest.status) ? (
                            <a

                              href={`mailto:${interest.email}`}
                              className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                            >
                              Contact
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              {interest.status === "declined" ? "Declined" : "Closed"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

        </div>
      </div>
    </div >
  );
}