import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchTestimonies, reactToTestimony } from "../../services/testimonyService";
import { API_BASE_URL } from "../../api/apiClient";

const REACTIONS = [
  { type: "praise", icon: "🙌", label: "Praise" },
  { type: "amen", icon: "✝️", label: "Amen" },
  { type: "thanks", icon: "🙏", label: "Thanks" }
];

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReact = async (testimonyId, reactionType) => {
    try {
      await reactToTestimony(testimonyId, reactionType);
      // The SSE will update the state
    } catch (err) {
      console.error("Reaction failed", err);
    }
  };

  const loadTestimonies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTestimonies();
      setItems(data);
    } catch (err) {
      setError("Failed to load testimonies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load initial testimonies
    loadTestimonies();

    // Set up SSE for real-time updates
    const token = localStorage.getItem("token");
    const eventSource = new EventSource(`${API_BASE_URL}/api/testimonies/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ping') return; // Ignore ping

      setItems((prevItems) => {
        let updatedItems = [...prevItems];

        if (data.type === 'testimony_added') {
          // Add new testimony to the top
          updatedItems = [data.testimony, ...updatedItems];
        } else if (data.type === 'testimony_reaction_added' || data.type === 'testimony_reaction_removed' || data.type === 'testimony_reaction_updated') {
          // Update reaction counts for the specific testimony
          updatedItems = updatedItems.map((item) => {
            if (item.id === data.testimony_id) {
              const newReactions = { ...item.reactions };
              if (data.type === 'testimony_reaction_added') {
                newReactions[data.reaction] += 1;
              } else if (data.type === 'testimony_reaction_removed') {
                newReactions[data.reaction] = Math.max(0, newReactions[data.reaction] - 1);
              } else if (data.type === 'testimony_reaction_updated') {
                newReactions[data.old_reaction] = Math.max(0, newReactions[data.old_reaction] - 1);
                newReactions[data.new_reaction] += 1;
              }
              return { ...item, reactions: newReactions };
            }
            return item;
          });
        }

        return updatedItems;
      });
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
    };

    return () => {
      eventSource.close();
    };
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

      {/* Load Button */}
      <div className="px-6 py-3">
        <button
          onClick={loadTestimonies}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          Refresh Testimonies
        </button>
      </div>

      {/* Testimonials List */}
      <div className="px-6 pb-24">
        {loading ? (
          <p className="text-center py-8">Loading testimonies...</p>
        ) : error ? (
          <p className="text-center py-8 text-red-600">{error}</p>
        ) : items.length === 0 ? (
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
                <div className="flex justify-end items-start mb-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                  {t.content}
                </p>

                {/* Reaction Buttons */}
                <div className="flex gap-3 mb-4">
                  {REACTIONS.map(r => (
                    <button
                      key={r.type}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation
                        handleReact(t.id, r.type);
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        t.userReaction === r.type
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {r.icon} {t.reactions?.[r.type] || 0}
                    </button>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <Link to="/users/testimonials/new">
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-colors z-10">
          +
        </button>
      </Link>
    </div>
  );
}