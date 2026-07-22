import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Building2, Plus, Lightbulb, User, Settings,
  Cpu, Briefcase, Heart, BookOpen, DollarSign, Star,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES, CATEGORY_LABELS } from "@/constants/categories";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Technology: Cpu,
  Business:   Briefcase,
  Health:     Heart,
  Education:  BookOpen,
  Finance:    DollarSign,
};

export default function Sidebar() {
  const { isOpen } = useSidebar();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden md:flex flex-col flex-shrink-0 border-r border-slate-200 bg-white h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto overflow-x-hidden transition-all duration-300 ${isOpen ? "w-56" : "w-16"
        }`}
    >
      <nav className="flex flex-col py-3">

        <SidebarLink to="/dashboard" icon={Home} label="Home" isOpen={isOpen} />
        <SidebarLink to="/companies" icon={Building2} label="Companies" isOpen={isOpen} />

        {user?.userType === "community" && (
          <button
            onClick={() => navigate("/create-idea")}
            title="Submit Idea"
            className={`flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors ${!isOpen ? "justify-center px-0" : ""
              }`}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span>Submit Idea</span>}
          </button>
        )}

        <Divider />

        {isOpen && (
          <p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Categories
          </p>
        )}

        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] ?? Lightbulb;
          return (
            <SidebarLink
              key={cat}
              to={`/category/${cat.toLowerCase()}`}
              icon={Icon}
              label={CATEGORY_LABELS[cat] ?? cat}
              isOpen={isOpen}
            />
          );
        })}

        <Divider />

        {isOpen && (
          <p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            You
          </p>
        )}

        {user?.userType === "community" && (
          <>
            <SidebarLink to="/my-ideas" icon={Lightbulb} label="My Ideas" isOpen={isOpen} />
            <SidebarLink to="/my-industry-interests" icon={Star} label="Industry Interest" isOpen={isOpen} />
          </>
        )}
        {user?.userType === "company" && (
          <SidebarLink to="/my-interests" icon={Star} label="My Interests" isOpen={isOpen} />
        )}
        <SidebarLink to="/profile" icon={User} label="Profile" isOpen={isOpen} />

      </nav>
    </aside>
  );
}

function SidebarLink({
  to, icon: Icon, label, isOpen,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  isOpen: boolean;
}) {
  return (
    <NavLink
      to={to}
      title={!isOpen ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 text-sm transition-colors ${isOpen ? "px-4" : "justify-center px-0"
        } ${isActive
          ? "bg-slate-100 font-medium"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#D4609A]" : ""}`} />
          {isOpen && (
            <span className={`truncate ${isActive ? "bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent" : ""}`}>
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function Divider() {
  return <div className="my-2 h-px bg-slate-200 mx-3" />;
}
