import { useState, useEffect } from "react";
import { ArrowBigUp, ArrowBigDown, MessageCircle } from "lucide-react";
import { VoteType, VoteResponse } from "../../types";

interface VotePillProps {
  ideaId: string;
  commentCount?: number;
}

export default function VotePill({ ideaId, commentCount = 0 }: VotePillProps) {
  const [netScore, setNetScore] = useState(0);
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const fetchVotes = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${ideaId}/vote`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: VoteResponse = await res.json();
      setNetScore(data.netScore);
      setUserVote(data.userVote);
    };

    if (ideaId) fetchVotes();
  }, [ideaId]);

  const handleVote = async (voteType: VoteType) => {
    if (isVoting) return; // ignore clicks while a request is in flight

    const prevNetScore = netScore;
    const prevUserVote = userVote;

    const removing = userVote === voteType;
    const switching = !removing && userVote !== null;
    const delta = removing
      ? (voteType === "up" ? -1 : 1)
      : switching
        ? (voteType === "up" ? 2 : -2)
        : (voteType === "up" ? 1 : -1);

    setIsVoting(true);
    setNetScore(prevNetScore + delta);
    setUserVote(removing ? null : voteType);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/${ideaId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });
      if (res.ok) {
        const data: VoteResponse = await res.json();
        setNetScore(data.netScore);
        setUserVote(data.userVote);
      } else {
        setNetScore(prevNetScore);
        setUserVote(prevUserVote);
      }
    } catch {
      setNetScore(prevNetScore);
      setUserVote(prevUserVote);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Vote pill */}
      <div className="flex items-center gap-1 bg-gray-200 rounded-full px-2 py-1">
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (!isVoting) handleVote("up");
          }}
          className={`p-1 rounded-full hover:bg-gray-300 ${isVoting ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
          <ArrowBigUp className={`w-4 h-4 ${userVote === "up" ? "text-orange-500" : "text-gray-600"}`} />
        </div>

        <span className="text-sm font-semibold text-gray-800 min-w-[32px] text-center">
          {netScore}
        </span>

        <div onClick={(e) => {
          e.stopPropagation();
          if (!isVoting) handleVote("down");
        }}
          className={`p-1 rounded-full hover:bg-gray-300 ${isVoting ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`} >
          <ArrowBigDown className={`w-4 h-4 ${userVote === "down" ? "text-blue-500" : "text-gray-600"}`} />
        </div>
      </div>
      <div className="flex items-center gap-1 cursor-pointer">
        <MessageCircle className="w-4 h-4 text-gray-600" />
        <span className="text-xs text-gray-600">{commentCount}</span>
      </div>
    </div >
  );
}
