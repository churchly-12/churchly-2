import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyPrayers, deletePrayer } from "../../services/prayerService";

export default function MyPrayerRequests() {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPrayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyPrayers();
      setPrayers(data || []);
    } catch (err) {
      setError("Failed to load prayers. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prayer request?")) {
      return;
    }
    try {
      const response = await deletePrayer(id);
      if (response.success) {
        setPrayers(prayers.filter(p => p.id !== id));
        alert("Prayer deleted successfully");
      } else {
        alert(response.message || "Failed to delete prayer request");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete prayer request");
    }
  };

  useEffect(() => {
    loadPrayers();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7efe6] text-[#3b2a20]">
      <h1 className="text-2xl font-bold mb-4">My Prayer Requests</h1>

      {loading ? (
        <p className="text-center py-8">Loading prayers...</p>
      ) : error ? (
        <p className="text-center py-8 text-red-600">{error}</p>
      ) : prayers.length === 0 ? (
        <p className="text-center py-8">No prayer requests found.</p>
      ) : (
        <div className="space-y-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{prayer.title}</p>
                  <p className="text-gray-700 mt-1">{prayer.requestText}</p>
                  <small className="text-gray-400 mt-2 block">
                    {new Date(prayer.createdAt).toLocaleString()}
                  </small>
                </div>
                <button
                  onClick={() => handleDelete(prayer.id)}
                  className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/users/prayer-wall/new">
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#6F4E37] hover:bg-[#5b3f2c] text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-colors">
          +
        </button>
      </Link>
    </div>
  );
}