import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Lightbulb, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Ideas",
    path: "/admin/ideas",
    icon: Lightbulb,
  },
];

export default function AdminLayout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── SIDEBAR ── */}
      <aside
        className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        {/* Inner wrapper keeps fixed w-64 so content doesn't reflow during animation */}
        <div className="w-64 h-full flex flex-col justify-between bg-white border-r border-gray-200 py-6 px-4">

          {/* Top: Logo + Nav */}
          <div>
            {/* Logo row + close button */}
            <div className="flex items-center justify-between px-2 mb-8">
              <div className="flex items-center gap-2">
                <div
                  className="flex size-8 items-center justify-center rounded-lg text-white shrink-0"
                  style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
                >
                  <LayoutDashboard className="size-4" />
                </div>
                <span className="font-bold text-gray-900 whitespace-nowrap">
                  UKM<span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
                  >StartUp</span>
                </span>
                <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Admin
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                  style={({ isActive }) =>
                    isActive
                      ? { background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }
                      : {}
                  }
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                  <ChevronRight className="size-3 ml-auto opacity-50" />
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom: User info + logout */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 px-2 mb-3">
              <div
                className="size-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
              >
                {user?.fullName?.charAt(0) ?? "A"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName ?? "Admin"}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar with hamburger */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 shrink-0 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Menu className="size-5" />
          </button>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}