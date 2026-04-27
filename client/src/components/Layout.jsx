import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={isOpen} />
      <main className="flex-1">
        <Topbar toggleSidebar={() => setIsOpen(!isOpen)} />
        <Outlet />
      </main>
    </div>
  );
}