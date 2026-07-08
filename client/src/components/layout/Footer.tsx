import { Link } from "react-router-dom";

type LinkItem = { label: string; to: string };
type Column = { heading: string; links: LinkItem[] };

const columns: Column[] = [
  {
    heading: "Explore",
    links: [
      { label: "All Ideas", to: "/dashboard" },
      { label: "Top Voted Ideas", to: "/dashboard" },
      { label: "Search Ideas", to: "/dashboard" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Submit New Idea", to: "/create-idea" },
      { label: "My Profile", to: "/profile" },
      { label: "My Industry Interests", to: "/profile" },
    ],
  },
  {
    heading: "Industry",
    links: [
      { label: "Explore Student Ideas", to: "/dashboard" },
      { label: "Interests Sent", to: "/profile" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About UKMStartUp", to: "" },
      { label: "FAQ", to: "" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-6 px-6 sm:px-10 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Brand + columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 mb-10">
          {/* Brand block */}
          <div className="lg:col-span-1">
            <span className="text-lg font-bold bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent">
              UKMStartUp
            </span>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Startup idea sharing platform for UKM students.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold text-slate-400 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-300 hover:text-[#D4609A] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} UKMStartUp · Final Year Project,
            Universiti Kebangsaan Malaysia
          </p>
          <p className="text-sm text-slate-500">
            Built by{" "}
            <span className="text-slate-300">Muhammad Akmal bin Bahari</span>
          </p>
        </div>
      </div>
    </footer>
  );
}