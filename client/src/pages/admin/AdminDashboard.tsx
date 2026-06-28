import { Card, CardContent, CardAction, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Lightbulb, Users, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────
interface OverviewStats {
  totalIdeas: number;
  totalUsers: number;
  totalVotes: number;
  totalComments: number;
}

interface IdeaOverTime {
  month: string;
  count: number;
}

interface TopIdea {
  id: string;
  startupName: string;
  upvoteCount: number;
  authorName: string;
}

interface UserBreakdown {
  label: string;
  count: number;
}

// ── Gradient colors ────────────────────────────────────────────
const GRADIENT_COLORS = ["#9B59D0", "#D4609A", "#E8745A", "#F0A500", "#4CAF50"];

const STAT_CARDS = (stats: OverviewStats) => [
  {
    label: "Total Ideas",
    value: stats.totalIdeas,
    icon: Lightbulb,
    color: "#9B59D0",
  },
  {
    label: "Total Users",
    value: stats.totalUsers,
    icon: Users,
    color: "#D4609A",
  },
  {
    label: "Total Votes",
    value: stats.totalVotes,
    icon: ThumbsUp,
    color: "#E8745A",
  },
  {
    label: "Total Comments",
    value: stats.totalComments,
    icon: MessageSquare,
    color: "#9B59D0",
  },
];

// ── Component ──────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [ideasOverTime, setIdeasOverTime] = useState<IdeaOverTime[]>([]);
  const [topIdeas, setTopIdeas] = useState<TopIdea[]>([]);
  const [userBreakdown, setUserBreakdown] = useState<UserBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, timeRes, topRes, breakdownRes] = await Promise.all([
          fetch(`${API}/api/admin/stats`, { headers }),
          fetch(`${API}/api/admin/ideas-over-time`, { headers }),
          fetch(`${API}/api/ideas/top-voted`, { headers }),
          fetch(`${API}/api/admin/user-breakdown`, { headers }),
        ]);

        const [statsData, timeData, topData, breakdownData] = await Promise.all([
          statsRes.json(),
          timeRes.json(),
          topRes.json(),
          breakdownRes.json(),
        ]);

        setStats(statsData);
        setIdeasOverTime(timeData);
        setTopIdeas(topData);
        setUserBreakdown(breakdownData);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#9B59D0", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and analytics</p>
      </div>

      {/* ── Overview Cards ── */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS(stats).map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div
                className="size-11 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${card.color}, #E8745A)` }}
              >
                <card.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{Number(card.value).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Ideas Over Time - takes 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="size-4 text-[#9B59D0]" />
            <h2 className="font-semibold text-gray-900">Ideas Submitted Over Time</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ideasOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="count" name="Ideas" radius={[4, 4, 0, 0]}>
                {ideasOverTime.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index % 2 === 0 ? "#9B59D0" : "#D4609A"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Breakdown - takes 1/3 width */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="size-4 text-[#D4609A]" />
            <h2 className="font-semibold text-gray-900">User Breakdown</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userBreakdown}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {userBreakdown.map((_, index) => (
                  <Cell
                    key={index}
                    fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px" }} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Top Voted Ideas ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <ThumbsUp className="size-4 text-[#E8745A]" />
          <h2 className="font-semibold text-gray-900">Top 5 Most Voted Ideas</h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topIdeas} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="startupName"
              tick={{ fontSize: 12 }}
              width={140}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
              formatter={(value) => [`${value} votes`, "Votes"]}
            />
            <Bar dataKey="upvoteCount" name="Votes" radius={[0, 4, 4, 0]}>
              {topIdeas.map((_, index) => (
                <Cell
                  key={index}
                  fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}