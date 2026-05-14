import { useState } from "react";
import { Search, Bell, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "@headlessui/react";
export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur border-b border-slate-200 flex items-center px-4 sm:px-6 gap-4">
      
    
      <a href="/dashboard" className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 shrink-0 ml-80">
        UKMStartUp
      </a>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto hidden sm:block ml-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari idea, syarikat, atau pengasas…"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 text-sm text-slate-700 placeholder:text-slate-400 border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        
        {/* Bell */}
        <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Hantar Idea */}
        <Button
          onClick={() => navigate("/create-idea")}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Hantar Idea
        </Button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center text-xs font-bold">
              {initials}
            </div>
            <span className="text-sm text-slate-700 font-medium hidden sm:block">
              {user?.fullName?.split(" ")[0]}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1 text-sm text-slate-700 shadow-lg z-50 focus:outline-none">
            <DropdownMenuItem>
              <a href="/profile" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 transition">
                <UserCircleIcon className="w-5 h-5 text-slate-400" />
                Profil
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="/settings" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 transition">
                <Cog6ToothIcon className="w-5 h-5 text-slate-400" />
                Tetapan
              </a>
            </DropdownMenuItem>
            <div className="my-1 h-px bg-slate-200" />
            <DropdownMenuItem>
              <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-500 hover:bg-rose-50 transition">
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                Log Keluar
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}