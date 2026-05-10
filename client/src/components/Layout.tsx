import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Topbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}