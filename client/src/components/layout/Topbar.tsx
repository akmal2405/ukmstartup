import { useState } from "react";
import { Search, Plus, User, LogOutIcon, LightbulbIcon, CogIcon, Building, ChevronDown, Menu, Star } from "lucide-react";
import NotificationDropdown from "@/components/NotificationDropdown";
import { useSidebar } from "@/context/SidebarContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CATEGORIES, CATEGORY_LABELS } from "../../constants/categories";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur border-b border-slate-200 flex items-center px-4 sm:px-6 gap-4">

      <button
        onClick={toggle}
        className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition shrink-0"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>
      <a href="/dashboard">
        <span className="text-xl font-bold tracking-tight text-foreground">
          UKM<span className="bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent">StartUp</span>
        </span>
      </a>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-auto hidden sm:block ml-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery("");
              }
            }}
            placeholder="Search ideas, companies, or founders…"
            className="w-72 pl-10 pr-4 py-2.5 rounded-full bg-slate-100 text-sm text-slate-700 placeholder:text-slate-400 border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        <NavigationMenu viewport={false} className="bg-white">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
              <NavigationMenuContent className="z-50 !bg-white border">
                <div className="w-56 p-2">
                  <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Categories
                  </p>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
                      className="w-full text-left px-3 py-2 text-sm rounded-md text-slate-700 hover:bg-slate-100 transition"
                    >
                      {CATEGORY_LABELS[cat] ?? cat}
                    </button>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem className="hidden md:flex">
              <Link to="/companies" className={navigationMenuTriggerStyle()}>
                Companies
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Bell */}
      <NotificationDropdown />

      {/* Hantar Idea */}
      {user?.userType === "community" && (
        <Button
          onClick={() => navigate("/create-idea")}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] text-white text-sm font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Submit Idea
        </Button>
      )}

      {/* Avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] text-white grid place-items-center text-xs font-bold overflow-hidden flex-shrink-0">
            {user?.profilePicture ? (
              <img src={user.profilePicture} className="w-full h-full object-cover" />
            ) : (
              initials)}
          </div>
          <span className="text-sm text-slate-700 font-medium hidden sm:block">
            {user?.fullName?.split(" ")[0]}
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 rounded-xl border border-slate-200 bg-white b p-1 text-sm text-slate-700 shadow-lg z-50 focus:outline-none">
          <DropdownMenuItem>
            <a href="/profile" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 transition">
              <User className="w-5 h-5 text-slate-400" />
              Profile
            </a>
          </DropdownMenuItem>
          {user?.userType === "community" && (
            <DropdownMenuItem>
              <a href="/my-ideas" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 transition">
                <LightbulbIcon className="w-5 h-5 text-slate-400" />
                My ideas
              </a>
            </DropdownMenuItem>
          )}
          {user?.userType === "company" && (
            <DropdownMenuItem>
              <a href="/my-interests" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100 transition">
                <Star className="w-5 h-5 text-slate-400" />
                My Interests
              </a>
            </DropdownMenuItem>
          )}

          <div className="my-1 h-px bg-slate-200" />
          <DropdownMenuItem>
            <Button
              onClick={logout}

              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-rose-500 hover:bg-rose-50 transition">
              <LogOutIcon className="w-5 h-5" />
              Log Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header >
  );
}