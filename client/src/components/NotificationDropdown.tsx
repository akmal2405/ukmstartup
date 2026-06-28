import { useState, useEffect } from "react";
import { Bell, ThumbsUp, ThumbsDown, MessageCircle, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: "upvote" | "downvote" | "comment" | "interest";
  message: string;
  ideaId: string;
  isRead: boolean;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function NotifIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "upvote":
      return <ThumbsUp className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />;
    case "downvote":
      return <ThumbsDown className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />;
    case "comment":
      return <MessageCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />;
    case "interest":
      return <Building2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />;
  }
}

const API = import.meta.env.VITE_API_URL as string;

function authHeader(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const res = await fetch(`${API}/api/notifications`, { headers: authHeader() });
      if (res.ok) setNotifications(await res.json());
    } catch {
      // silent — polling failure must not surface to the user
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const hasUnread = notifications.some((n) => !n.isRead);

  const handleNotificationClick = (n: Notification) => {
    setOpen(false);
    if (!n.isRead) {
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
      );
      fetch(`${API}/api/notifications/${n.id}/read`, {
        method: "PUT",
        headers: authHeader(),
      }).catch(() => { });
    }
    navigate(`/idea/${n.ideaId}`);
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API}/api/notifications/read-all`, {
        method: "PUT",
        headers: authHeader(),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silent
    }
  };

  return (
    <DropdownMenu
      open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition">
          <Bell className="w-5 h-5" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0 bg-white border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">Notifications</span>
          {hasUnread && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-indigo-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${!n.isRead ? "bg-[#D4609A]/10" : ""
                  }`}
              >
                <NotifIcon type={n.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug text-slate-700">{n.message}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#D4609A]" />
                )}
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
