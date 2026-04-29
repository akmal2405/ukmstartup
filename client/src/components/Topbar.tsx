import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { user, logout } = useAuth();
  const displayName = user?.fullName;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header className="h-16 bg-white border border-gray-200  flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Bars3Icon className="w-6 h-6 text-gray-600" />
        </button>

        <h2 className="text-lg font-semibold text-gray-700"></h2>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for ideas, users..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Search
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <span className="text-sm text-gray-600">{displayName}</span>

        <Menu as="div" className="relative">
          <MenuButton className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition">
            {displayName?.charAt(0)?.toUpperCase() || "U"}
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="absolute right-0 mt-2 w-44 origin-top-right rounded-xl border bg-white p-1 text-sm text-gray-700 shadow-lg transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            <MenuItem>
              <a
                href="/profile"
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 data-focus:bg-gray-100"
              >
                <UserCircleIcon className="w-5 h-5 text-gray-400" />
                Profile
              </a>
            </MenuItem>

            <MenuItem>
              <a
                href="/settings"
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 data-focus:bg-gray-100"
              >
                <Cog6ToothIcon className="w-5 h-5 text-purple-400" />
                Settings
              </a>
            </MenuItem>

            <div className="my-1 h-px bg-gray-200"></div>

            <MenuItem>
              <button
                onClick={logout}
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-500 data-focus:bg-red-50"
              >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </header>
  );
}
