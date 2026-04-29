import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  LightBulbIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isOpen: boolean;
  active?: boolean;
  to?: string;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0 overflow-hidden p-0"
      } bg-white border-gray-200 h-screen transition-all duration-300`}
    >
      <div></div>
      <h1
        className={`text-xl font-bold text-indigo-500 mb-5 ml-5 mt-5 ${
          !isOpen && "hidden"
        }`}
      >
        UKMStartUp
      </h1>

      <nav className="space-y-2">
        <SidebarItem
          icon={HomeIcon}
          label="Papan Pemuka"
          isOpen={isOpen}
          active={location.pathname === "/dashboard"}
          to="/dashboard"
        />
        <SidebarItem
          icon={LightBulbIcon}
          label="Cipta Idea Startup"
          isOpen={isOpen}
          active={location.pathname === "/create-idea"}
          to="/create-idea"
        />
        <SidebarItem
          icon={LightBulbIcon}
          label="Idea Saya"
          isOpen={isOpen}
        />

        <hr className="my-4 border-gray-200" />

        <SidebarItem icon={UserIcon} label="Teroka" isOpen={isOpen} />
        <SidebarItem icon={Cog6ToothIcon} label="Tular" isOpen={isOpen} />
        <SidebarItem icon={UserIcon} label="Profil" isOpen={isOpen} />
      </nav>
    </aside>
  );
}

function SidebarItem({ icon: Icon, label, isOpen, active = false, to }: SidebarItemProps) {
  const className = `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
    active
      ? "bg-blue-100 text-indigo-500 font-semibold"
      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
  }`;

  const content = (
    <>
      <Icon className="w-5 h-5" />
      {isOpen && <span>{label}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
