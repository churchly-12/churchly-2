import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationSettings() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(true);

  const handleSave = () => {
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft size={22} onClick={() => navigate(-1)} className="cursor-pointer" />
        <h1 className="text-xl font-semibold">Notifications</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md flex justify-between items-center">
        <span className="text-gray-800 font-medium">Enable Notifications</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-5 h-5"
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-5 w-full bg-[#6b4a2d] text-white p-3 rounded-xl"
      >
        Save
      </button>

    </div>
  );
}