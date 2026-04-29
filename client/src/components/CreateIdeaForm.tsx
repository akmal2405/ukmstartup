import { useState } from "react";

interface CreateIdeaFormProps {
  onSuccess?: () => void;
}

interface FormData {
  startupName: string;
  category: string;
  phoneNumber: string;
  shortDescription: string;
  status: string;
}

const CreateIdeaForm = ({ onSuccess }: CreateIdeaFormProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    startupName: "",
    category: "",
    phoneNumber: "",
    shortDescription: "",
    status: "draft",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    data.append("startupName", formData.startupName);
    data.append("category", formData.category);
    data.append("phoneNumber", formData.phoneNumber);
    data.append("shortDescription", formData.shortDescription);
    data.append("status", formData.status);

    if (logoFile) data.append("logo", logoFile);
    if (coverFile) data.append("cover", coverFile);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/ideas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) throw new Error("Failed to submit idea");

      const result = await response.json();
      console.log("Idea created:", result);

      alert("Idea submitted successfully!");

      setFormData({
        startupName: "",
        category: "",
        phoneNumber: "",
        shortDescription: "",
        status: "draft",
      });
      setLogoFile(null);
      setCoverFile(null);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert("Error submitting idea");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-4"
    >
      <input
        type="text"
        name="startupName"
        value={formData.startupName}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Startup / Company Name"
        required
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        required
      >
        <option value="">Select category</option>
        <option value="Technology">Technology</option>
        <option value="Business">Business</option>
        <option value="Education">Education</option>
        <option value="Social">Social</option>
      </select>

      <input
        type="text"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        placeholder="Phone Number"
      />

      <label className="block text-sm font-medium text-gray-700">Logo Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
        className="w-full border rounded px-3 py-2"
      />

      <label className="block text-sm font-medium text-gray-700">Cover Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
        className="w-full border rounded px-3 py-2"
      />

      <textarea
        name="shortDescription"
        value={formData.shortDescription}
        onChange={handleChange}
        rows={3}
        className="w-full border rounded px-3 py-2"
        placeholder="Describe your startup idea briefly..."
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit Idea
      </button>
    </form>
  );
};

export default CreateIdeaForm;
