import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LockIcon, MailIcon, EyeOffIcon, EyeIcon, Lightbulb, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UKMStartUPLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const location = useLocation();
  const signupMessage = (location.state as { message?: string })?.message ?? "";

  const handleResend = async () => {
    setResendStatus("sending");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResendStatus(res.ok ? "sent" : "failed");
    } catch {
      setResendStatus("failed");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNeedsVerification(false);
    setResendStatus("idle");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);

        if (data.user.communityRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Login Failed");
        if (response.status === 403 && data.needsVerification) {
          setNeedsVerification(true);
        }
      }
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running on port 5000.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── gradient background with brand info */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-between p-12 text-white"
        style={{ background: "linear-gradient(135deg, #9B59D0, #D4609A, #E8745A)" }}
      >
        {/* Logo at top */}
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center">
          </div>
          <span className="text-xl font-bold tracking-tight"></span>
        </div>

        {/* Center content */}
        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Turn your idea<br />into a startup.
          </h1>
          <p className="text-white/80 text-lg mb-10">
            The exclusive platform for UKM students to pitch, evaluate, and connect.
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-white/90 shrink-0" />
              <div>
                <p className="font-semibold">Share Your Ideas</p>
                <p className="text-white/70 text-sm">Post your startup concept and gather community feedback</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-white/90 shrink-0" />
              <div>
                <p className="font-semibold">Get AI Feedback</p>
                <p className="text-white/70 text-sm">Instant AI evaluation with score, strengths and improvements</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="size-5 text-white/90 shrink-0" />
              <div>
                <p className="font-semibold">Connect with Industry</p>
                <p className="text-white/70 text-sm">Get noticed by real industry partners looking to invest</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-white/60 text-sm">
          Universiti Kebangsaan Malaysia · Student Innovation Platform
        </p>
      </div>

      {/* ── RIGHT PANEL ── login form */}
      <div className="flex flex-1 items-center justify-center bg-white p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent mb-2 leading-snug">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm mb-7">Log in to your UKMStartUp account</p>

          {signupMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {signupMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
              {needsVerification && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  {resendStatus === "sent" ? (
                    <p className="text-green-700 text-xs font-medium">Verification email sent! Check your inbox.</p>
                  ) : resendStatus === "failed" ? (
                    <p className="text-xs">Failed to resend. Please try again.</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendStatus === "sending"}
                      className="text-[#9B59D0] text-xs font-semibold hover:underline disabled:opacity-50"
                    >
                      {resendStatus === "sending" ? "Sending…" : "Resend verification email"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="relative mb-3">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MailIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute left-10 top-2 text-xs text-gray-400">Email</div>
              <input
                type="email"
                placeholder="example@siswa.ukm.edu.my"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 pt-6 pb-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 outline-none focus:border-[#9B59D0] transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <LockIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute left-10 top-2 text-xs text-gray-400">Password</div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 pt-6 pb-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 outline-none focus:border-[#9B59D0] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeOffIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#9B59D0]"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-[#9B59D0] font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold rounded-lg text-sm transition-opacity mb-6 disabled:opacity-50 disabled:cursor-not-allowed text-white hover:opacity-90"
              style={{ background: "linear-gradient(to right, #9B59D0, #D4609A, #E8745A)" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#9B59D0] font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}