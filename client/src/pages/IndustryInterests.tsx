import { useState, useEffect } from "react";
import { InterestStatus, SentInterest } from "@/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const STATUS_CONFIG: Record<InterestStatus, { label: string; className: string }> = {
  pending:       { label: "Pending",       className: "bg-gray-100 text-gray-600"   },
  contacted:     { label: "Contacted",     className: "bg-blue-100 text-blue-700"   },
  in_discussion: { label: "In Discussion", className: "bg-amber-100 text-amber-700" },
  declined:      { label: "Declined",      className: "bg-red-100 text-red-700"     },
  closed:        { label: "Closed",        className: "bg-green-100 text-green-700" },
};

function StatusBadge({ status }: { status: InterestStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

export default function IndustryInterests() {
  const [sentInterests, setSentInterests] = useState<SentInterest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentInterests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/interests/my-sent`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data: SentInterest[] = await res.json();
        setSentInterests(data);
      } catch (err) {
        console.error("Error fetching sent interests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSentInterests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900">My Interests</h1>
          {!loading && (
            <span className="text-sm text-slate-500">
              {sentInterests.length} interest{sentInterests.length !== 1 ? "s" : ""} sent
            </span>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : sentInterests.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
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
                    <TableCell className="font-medium">
                      <p className="truncate">{interest.ideaName}</p>
                    </TableCell>
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
                          href={`https://mail.google.com/mail/?view=cm&to=${interest.ownerEmail}`}
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
      </main>
    </div>
  );
}
