import { useState, useEffect } from "react";
import { fetchMyTestimonies, deleteTestimony } from "../../services/testimonyService";
import { Trash2 } from "lucide-react";
import apiClient from "../../api/apiClient";

export default function MyTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMyTestimonies();
      setTestimonials(data);
    } catch (err) {
      setError("Failed to load your testimonies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimony?")) return;

    try {
      const res = await deleteTestimony(id);
      if (res.success) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
      } else {
        alert("Failed to delete testimony: " + res.message);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete testimony");
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Testimonials</h1>

      <button
        onClick={loadTestimonials}
        className="px-4 py-2 bg-[#6b4a2d] text-white rounded-lg hover:bg-[#5a3e25] transition"
      >
        Refresh
      </button>

      {loading ? (
        <p className="text-center py-8">Loading your testimonies...</p>
      ) : error ? (
        <p className="text-center py-8 text-red-600">{error}</p>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't posted any testimonies yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Share your story on the testimonials page!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl shadow-md p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-gray-500">
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Delete testimony"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed">{t.content}</p>

              {t.is_anonymous && (
                <p className="text-xs text-gray-400 mt-2">Posted anonymously</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}