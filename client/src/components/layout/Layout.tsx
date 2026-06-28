import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/context/SidebarContext";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
        <Topbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}