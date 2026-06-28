import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Network error. Please try again.");
      });
  }, []);

  // ...rest of the component stays exactly the same

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg,#9B59D0,#E8745A)" }}
        >
          {status === "loading" && <Spinner />}
          {status === "success" && <CheckIcon />}
          {status === "error" && <XIcon />}
        </div>

        {status === "loading" && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying your email…</h2>
            <p className="text-gray-500 text-sm">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Email verified!</h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-semibold"
              style={{ background: "linear-gradient(135deg,#9B59D0,#E8745A)" }}
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Verification failed</h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <Link to="/login" className="text-indigo-600 text-sm font-medium hover:underline">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );
}

function CheckIcon() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
