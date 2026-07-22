import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Interest, InterestStatus } from "@/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
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

export default function IndustryInterestsReceived() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900">Industry Interest</h1>
          {!loading && (
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
              {interests.length} compan{interests.length !== 1 ? "ies" : "y"}
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : interests.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
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
      </main>
    </div>
  );
}
