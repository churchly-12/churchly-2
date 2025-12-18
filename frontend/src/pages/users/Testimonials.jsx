import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTestimonials } from "../../utils/testimonialStorage";

export default function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getTestimonials());
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-[#B3B3B3]">
      {/* Header */}
      <div className="bg-[#6F4E37] text-white p-4 flex items-center">
        <h1 className="text-xl font-bold">✨ Testimonials</h1>
      </div>

      {/* Header Description */}
      <div className="px-6 py-3">
        <p className="text-gray-600 dark:text-[#B3B3B3] text-sm">
          Share what God has done in your life
        </p>
      </div>

      {/* Testimonials List */}
      <div className="px-6 pb-24">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No testimonies yet.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Be the first to share your story!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((t) => (
              <div
                key={t.id}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 shadow-sm border border-yellow-200 dark:border-yellow-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                    {t.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                  {t.story}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      ❤️ {t.responses?.length || 0} praises
                    </span>
                  </div>

                  <Link
                    to={`/testimonials/${t.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View & Respond
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <Link to="/testimonials/new">
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-colors z-10">
          +
        </button>
      </Link>
    </div>
  );
}