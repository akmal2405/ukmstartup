import { useState, useEffect } from "react";
import { ArrowBigUp, ArrowBigDown, MessageCircle } from "lucide-react";
import { VoteType, VoteResponse } from "../types";

interface VotePillProps {
  ideaId: number;
  commentCount?: number;
}

export default function VotePill({ ideaId, commentCount = 0 }: VotePillProps) {
  const [netScore, setNetScore] = useState(0);
  const [userVote, setUserVote] = useState<VoteType | null>(null);

  useEffect(() => {
    const fetchVotes = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${ideaId}/vote`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: VoteResponse = await res.json();
      console.log("vote response:", data);
      setNetScore(data.net_score);
      setUserVote(data.user_vote);
    };

    if (ideaId) fetchVotes();
  }, [ideaId]);

  const handleVote = async (voteType: VoteType) => {
    console.log("handleVote called with:", voteType);
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${ideaId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ voteType }),
    });

    console.log("res status:", res.status);
    const data: VoteResponse = await res.json();
    console.log("vote response:", data);
    setNetScore(data.net_score);

    if (userVote === voteType) {
      setUserVote(null);
    } else {
      setUserVote(voteType);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-gray-200 rounded-full px-2 py-1">
      <div onClick={() => handleVote("up")} className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
        <ArrowBigUp className={`w-4 h-4 ${userVote === "up" ? "text-orange-500" : "text-gray-600"}`} />
      </div>

      <span className="text-sm font-semibold text-gray-800 min-w-[32px] text-center">
        {netScore}
      </span>

      <div onClick={() => handleVote("down")} className="p-1 rounded-full hover:bg-gray-300 cursor-pointer">
        <ArrowBigDown className={`w-4 h-4 ${userVote === "down" ? "text-blue-500" : "text-gray-600"}`} />
      </div>

      <div className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-300 cursor-pointer">
        <MessageCircle className="w-4 h-4 text-gray-600" />
        <span className="text-xs text-gray-600">{commentCount}</span>
      </div>
    </div>
  );
}
