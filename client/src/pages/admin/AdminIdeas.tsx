import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface AdminIdea {
  id: string;
  startupName: string;
  category: string;
  status: string;
  upvoteCount: number;
  downvoteCount: number;
  createdAt: string;
  ownerName: string;
}

export default function AdminIdeas() {
  const [ideas, setIdeas] = useState<AdminIdea[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/ideas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: AdminIdea[] = await res.json();
        setIdeas(data);
      } catch (err) {
        console.error("Error fetching ideas:", err);
      }
    };

    fetchIdeas();
  }, []);

  const handleDelete = async (ideaId: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/ideas/${ideaId}`, {
      headers: { Authorization: `Bearer ${token}` },
      method: "DELETE",
    });
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Ideas</h1>
        <p className="text-gray-500 text-sm mt-1">{ideas.length} submitted ideas</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Startup Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideas.map((idea) => (
              <TableRow key={idea.id}>
                <TableCell className="font-medium">{idea.startupName}</TableCell>
                <TableCell className="capitalize">{idea.category}</TableCell>
                <TableCell>{idea.ownerName}</TableCell>
                <TableCell>
                  <span className="text-green-600">↑{idea.upvoteCount}</span>
                  {" / "}
                  <span className="text-red-500">↓{idea.downvoteCount}</span>
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    idea.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {idea.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
