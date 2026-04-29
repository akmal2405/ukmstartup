import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/ukmstartup_logo.png";
import { LockIcon, MailIcon, EyeOffIcon, EyeIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function UKMStartUPLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login Failed");
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
    <div className="min-h-screen flex bg-gray-200">
      <div className="hidden lg:flex flex-1 items-center justify-center p-10">
        <img src={logoImg} alt="UKMStartUP Logo" className="max-w-lg w-full" />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-indigo-500 mb-7 leading-snug">
          Welcome to
          <br />
          UKMStartUP
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleLogin}>
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
              className="w-full pl-10 pr-4 pt-6 pb-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

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
              className="w-full pl-10 pr-10 pt-6 pb-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-800 outline-none focus:border-indigo-500 transition-colors"
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

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-indigo-500"
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-indigo-500 font-medium hover:underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg text-sm transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-500 font-semibold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
