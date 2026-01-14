import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EditCommunityZone() {
  const navigate = useNavigate();
  const [community, setCommunity] = useState("St. Joseph Community");

  const handleSave = () => {
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft size={22} onClick={() => navigate(-1)} className="cursor-pointer" />
        <h1 className="text-xl font-semibold text-gray-900">Edit Community / Zone</h1>
      </div>

      {/* Input Field */}
      <div className="bg-white p-4 rounded-2xl shadow-md">
        <label className="text-sm text-gray-600">Community / Zone</label>
        <input
          type="text"
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#6b4a2d] focus:outline-none"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-5 w-full bg-[#6b4a2d] text-white p-3 rounded-xl"
      >
        Save
      </button>
    </div>
  );
}