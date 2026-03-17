import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CreateIdeaForm from "../components/CreateIdeaForm";

export default function CreateIdea() {
  const [isOpen, setIsOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex bg-gray-100">
      <Sidebar isOpen={isOpen} />

      <main className="flex-1">
        <Topbar toggleSidebar={() => setIsOpen(!isOpen)} />

        <section className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">CIPTA IDEA BARU</h1>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              +   CIPTA IDEA
            </button>
          )}

          {showForm && (
            <CreateIdeaForm onSuccess={()=> setShowForm(false)} />
          )}
        </section>
      </main>
    </div>
  );
}
