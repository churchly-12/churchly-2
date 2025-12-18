import { ChevronLeft, User } from "lucide-react";
import { useState } from "react";

export default function EditFullName() {
  const [name, setName] = useState("John Christopher");

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ChevronLeft size={24} className="text-gray-600" />
        <h1 className="text-xl font-bold text-gray-900">Edit Full Name</h1>
      </div>

      {/* Field */}
      <label className="block text-gray-700 font-medium">Full Name</label>
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md border">
        <User size={20} className="text-[#6b4a2d]" />
        <input
          type="text"
          className="w-full outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button className="w-full bg-[#6b4a2d] text-white p-3 rounded-xl font-semibold">
        Save Changes
      </button>
    </div>
  );
}