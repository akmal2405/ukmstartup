
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext";
import { Idea, User } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";


export default function AdminUsers() {

  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUser();
    console.log(user)
  }, []);

  const handleDelete = async (userId: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` },
      method: "DELETE",
    });
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };



  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.userType}</TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => handleDelete(user.id)}
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
  )
}



