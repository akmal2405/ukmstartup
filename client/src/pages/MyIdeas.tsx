import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Idea } from "@/types";
import { useNavigate } from "react-router-dom";
import { Plus, Lightbulb } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STATUS_CLASS: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-700",
};

export default function MyIdeas() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [deleteTarget, setDeleteTarget] = useState<Idea | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/my-ideas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Idea[] = await res.json();
        setIdeas(data);
      } catch (err) {
        console.error("Error fetching ideas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${deleteTarget.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      method: "DELETE",
    });
    setIdeas((prev) => prev.filter((idea) => idea.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Ideas</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the startup ideas you've submitted
          </p>
        </div>

      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading...</div>
        ) : ideas.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center px-6">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3">
              <Lightbulb className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">No ideas yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              Share your first startup idea with the community
            </p>
            <button
              onClick={() => navigate("/create-idea")}
              className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] text-white hover:bg-indigo-700 transition"
            >
              Submit Idea
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <span className="text-center text-sm font-semibold px-3 py-1 rounded-full  text-indigo-700">
                You have a total of {ideas.length} idea{ideas.length !== 1 ? "s" : ""} you created
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Startup Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ideas.map((idea) => (
                  <TableRow key={idea.id}>
                    <TableCell className="font-medium text-slate-900">{idea.startupName}</TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                        {idea.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => navigate(`/idea/${idea.id}`)}
                          className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/idea/${idea.id}/edit`)}
                          className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(idea)}
                          className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>

                ))}
              </TableBody>
            </Table>
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
              <AlertDialogContent className="max-w-sm bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{deleteTarget?.startupName}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}