import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import CommentSection from "../components/CommentSection";
import VotePill from "../components/VotePill";
import { comment } from "postcss";



export default function PitchDeck() {
  const { user } = useAuth(); 
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${id}`);
        const data = await res.json();
        setIdea(data);
      } catch (err) {
        console.error("Error fetching idea:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!idea) return (
    <div className="p-6">
      <p className="text-gray-500">Idea not found.</p>
    </div>
  );

    const isOwner = user?.id === idea?.user_id;


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-start gap-8">

        {/* Left side - 60% */}
        <div className="flex-1 min-w-0">
          {/* Category badge */}
          <p className="text-xs text-blue-600 font-semibold uppercase mb-2">
            {idea.category}
          </p>

          {/* Owner */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">
                {idea.owner_name?.charAt(0)}
              </span>
            </div>
            <span className="font-semibold text-gray-900">{idea.owner_name}</span>
          </div>

          {/* Cover image */}
          <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100 mb-6">
            {idea.cover_image_url ? (
              <img
                src={`http://localhost:5000${idea.cover_image_url}`}
                alt={idea.startup_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">No cover image</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-4">
            <button className="pb-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">
              About
            </button>
            <button className="pb-2 text-sm font-semibold text-gray-500 hover:text-gray-700">
              Q&A
            </button>
            <button className="pb-2 text-sm font-semibold text-gray-500 hover:text-gray-700">
              Pitch Deck
            </button>   
          </div>

          {/* Tab content */}
          <p className="text-gray-600">{idea.short_description}</p>
        </div>

        {/* Right side - 40% */}
          <div className="w-80 flex-shrink-0 space-y-4 mt-16">
          {/* Stats card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 pt-5 px-6 pb-4">
            <h3 className="font-bold text-gray-900 mb-3">Idea Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <VotePill ideaId={idea.id} commentCount={idea.comment_count}></VotePill>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{idea.downvote_count}</span>
              </div>
            </div>
          </div>

          {/* Comments placeholder */}
          <CommentSection ideaId={id} />  
        </div>

      </div>
    </div>
  );
}
