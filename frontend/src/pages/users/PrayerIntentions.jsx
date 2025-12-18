import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrayerIntentionsPage() {
  const navigate = useNavigate();
  const [intentions, setIntentions] = useState([
    "For world peace",
    "For the sick and suffering",
    "For my family"
  ]);
  const [newIntention, setNewIntention] = useState("");

  const addIntention = () => {
    if (newIntention.trim()) {
      setIntentions([...intentions, newIntention.trim()]);
      setNewIntention("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e8d8] text-[#3a2c1a] px-4 pt-16 py-6">

      {/* Custom Top Bar */}
      <motion.nav
        className="w-full shadow-md fixed top-0 left-0 z-40"
        style={{ backgroundColor: '#6F4E37' }}
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200 transition flex items-center"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            {/* Title in the center */}
            <h1 className="text-xl font-bold text-white tracking-wide">Prayer Intentions</h1>

            {/* Empty space for balance */}
            <div className="w-6"></div>
          </div>
        </div>
      </motion.nav>

      <h1 className="text-2xl font-bold text-center">Prayer Intentions</h1>
      <p className="text-center opacity-70 text-sm mt-1">Share and pray for intentions</p>

      <div className="mt-6">
        <div className="bg-gray-50 border border-gray-200 rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Add a Prayer Intention</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newIntention}
              onChange={(e) => setNewIntention(e.target.value)}
              placeholder="Enter your prayer intention..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={addIntention}
              className="px-4 py-2 bg-[#6b4a2d] text-white rounded-lg hover:bg-[#5a3d24]"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Current Intentions</h2>
          <div className="space-y-3">
            {intentions.map((intention, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl shadow p-4">
                <p className="text-sm">{intention}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}