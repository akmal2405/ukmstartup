import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import VotePill from "../components/VotePill";
import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {user} = useAuth();

  // Handles browser back button loading from cache
  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/ideas");
      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      console.error("Error fetching ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar isOpen={isOpen} />

      <main className="flex-1">
        <Topbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <section className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Selamat Datang ke UKMStartUp
              </h3>
              <p className="text-gray-600 mt-1">
                Terokai idea startup terkini dari komuniti UKM
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : ideas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-xl text-gray-500 mb-4">
                Belum ada idea startup.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} user={user}/>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function IdeaCard({ idea, user }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {idea.cover_image_url ? (
          <img
            src={`http://localhost:5000${idea.cover_image_url}`}
            alt={idea.company_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <span className="text-white text-6xl font-bold opacity-20">
              {idea.company_name?.charAt(0) || "?"}
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm">
            {idea.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          {idea.logo_url ? (
            <img
              src={`http://localhost:5000${idea.logo_url}`}
              alt={idea.company_name}
              className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
              <span className="text-2xl font-bold text-gray-400">
                {idea.company_name?.charAt(0) || "?"}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {idea.company_name}
            </h3>
            <p className="text-xs text-gray-500 truncate">by {idea.owner_name}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
          {idea.short_description || "Maklumat lanjut akan dikemaskini tidak lama lagi."}
        </p>

        <div className="flex gap-2">
          {user?.userType === "company" && (
            <button className="flex-1 bg-indigo-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
              Tunjukkan Minat 
            </button>
          )}
        </div>
        <br />
        <div className="flex justify-between items-center">
          <VotePill />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Posted{" "}
              {new Date(idea.created_at).toLocaleDateString("en-MY", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-medium">
              OPEN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}