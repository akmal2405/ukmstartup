import { useState } from "react";
import { Link } from "react-router-dom";
import { MailIcon } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // silently ignored — we always show the same message
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent mb-1">
          Forgot Password?
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              If that email is registered, you'll receive a password reset link shortly. Check your inbox (and spam folder).
            </div>
            <Link
              to="/login"
              className="block text-center text-sm text-[#9B59D0] font-medium hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MailIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute left-10 top-2 text-xs text-gray-400">Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@siswa.ukm.edu.my"
                required
                className="w-full pl-10 pr-4 pt-6 pb-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 outline-none focus:border-[#9B59D0] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold rounded-lg text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>

            <Link
              to="/login"
              className="block text-center text-sm text-slate-500 hover:text-slate-700"
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
