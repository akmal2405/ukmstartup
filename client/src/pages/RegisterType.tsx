import { Users, Building2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterType() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent">UKMStartUp</h1>
          <p className="text-gray-600">Choose your account type</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("community")}
            className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left group"
          >
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 border bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A]">
              <Users className="w-8 h-8  group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">UKM Community</h3>
            <p className="text-gray-600 mb-6">
              For UKM students, lecturers, and staff who want to share startup ideas
            </p>
            <div className="flex items-center bg-gradient-to-r from-[#9B59D0] via-[#D4609A] to-[#E8745A] bg-clip-text text-transparent font-semibold">
              Continue
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => navigate("company")}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left group"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
              <Building2 className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Company / Industry</h3>
            <p className="text-gray-600 mb-6">
              For companies and industry partners looking for new ideas and talent
            </p>
            <div className="flex items-center text-indigo-600 font-semibold">
              Continue
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text font-semibold hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
