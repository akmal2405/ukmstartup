import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        navigate("/login", { state: { message: data.message } });
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
          <p className="text-sm text-red-600">Invalid reset link.</p>
          <Link to="/forgot-password" className="text-sm text-[#9B59D0] font-medium hover:underline">
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent mb-1">
          Set New Password
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Choose a strong password for your account.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
            {error.toLowerCase().includes("invalid or has expired") && (
              <div className="mt-2">
                <Link to="/forgot-password" className="text-[#9B59D0] font-semibold hover:underline text-xs">
                  Request a new reset link
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New password */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <LockIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="absolute left-10 top-2 text-xs text-gray-400">New Password</div>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-10 pt-6 pb-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 outline-none focus:border-[#9B59D0] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showNew ? <EyeIcon className="w-5 h-5 text-gray-400" /> : <EyeOffIcon className="w-5 h-5 text-gray-400" />}
            </button>
          </div>

          {/* Confirm password */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <LockIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="absolute left-10 top-2 text-xs text-gray-400">Confirm Password</div>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-10 pt-6 pb-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 outline-none focus:border-[#9B59D0] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirm ? <EyeIcon className="w-5 h-5 text-gray-400" /> : <EyeOffIcon className="w-5 h-5 text-gray-400" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold rounded-lg text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>

          <Link
            to="/login"
            className="block text-center text-sm text-slate-500 hover:text-slate-700"
          >
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
