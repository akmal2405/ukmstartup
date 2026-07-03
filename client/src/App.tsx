import { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UKMStartUPLogin from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateIdea from "./pages/CreateIdea";
import Footer from "./components/layout/Footer";
import UKMStartUPRegister from "./pages/RegisterType";
import Register from "./pages/Signup";
import { useAuth } from "./context/AuthContext";
import PitchDeck from "./pages/PitchDeck";
import Layout from "./components/layout/Layout";
import Profile from "./pages/Profile";
import MyIdeas from "./pages/MyIdeas";
import CategoryPage from "./pages/CategoryPage";
import LandingPage from "./pages/LandingPage";
import CompaniesDirectory from "./pages/CompaniesDirectory";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminIdeas from "./pages/admin/AdminIdeas";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SearchResults from "./pages/SearchResults";
import CompanyProfile from "./pages/CompanyProfile";
import IndustryInterests from "./pages/IndustryInterests";
import EditIdea from "./pages/EditIdea";


function ProtectedRoute({ children }: { children: ReactNode }) {
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

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, authChecked } = useAuth();

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#9B59D0", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.communityRole !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<UKMStartUPLogin />} />
        <Route path="/login" element={<UKMStartUPLogin />} />
        <Route path="/signup" element={<UKMStartUPRegister />} />
        <Route path="/signup/:type" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-idea" element={<CreateIdea />} />
          <Route path="/idea/:id" element={<PitchDeck />} />
          <Route path="/idea/:id/edit" element={<EditIdea />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-ideas" element={<MyIdeas />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/companies" element={<CompaniesDirectory />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/my-interests" element={<IndustryInterests />} />
          {/* <Route path="/dashboard/idea/:id" element={<PitchDeck />} /> */}
        </Route>


        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/ideas" element={<AdminIdeas />} />



        </Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}




export default App;