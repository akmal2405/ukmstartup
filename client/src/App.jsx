import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // ← add Navigate
import UKMStartUPLogin from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateIdea from "./pages/CreateIdea";
import Footer from "./components/Footer";
import UKMStartUPRegister from "./pages/RegisterType";
import Register from "./pages/Signup";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, authChecked } = useAuth();

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<UKMStartUPLogin />} />
          <Route path="/login" element={<UKMStartUPLogin />} />
          <Route path="/signup" element={<UKMStartUPRegister />} />
          <Route path="/signup/:type" element={<Register />} />
          {/* ← ProtectedRoute wrapping below */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-idea" element={
            <ProtectedRoute>
              <CreateIdea />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;