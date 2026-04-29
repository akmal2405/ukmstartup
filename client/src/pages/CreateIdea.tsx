import { useState } from "react";
import CreateIdeaForm from "../components/CreateIdeaForm";

export default function CreateIdea() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">CIPTA IDEA BARU</h1>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + CIPTA IDEA
        </button>
      )}

      {showForm && <CreateIdeaForm onSuccess={() => setShowForm(false)} />}
    </section>
  );
}
