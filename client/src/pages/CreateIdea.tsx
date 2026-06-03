import { useNavigate } from "react-router-dom";
import CreateIdeaForm from "../components/ideas/CreateIdeaForm";
import { ArrowLeft } from "lucide-react";

export default function CreateIdea() {
  const navigate = useNavigate();

  return <CreateIdeaForm onSuccess={() => navigate("/dashboard")} />;
}