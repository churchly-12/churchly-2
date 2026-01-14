import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPrayers, reactToPrayer } from "../../services/prayerService";
import { API_BASE_URL } from "../../api/apiClient";

const REACTIONS = [
  { type: "prayed", icon: "🙏", label: "Prayed" },
  { type: "amen", icon: "✝️", label: "Amen" },
  { type: "peace", icon: "🕊️", label: "Peace" }
];

export default function PrayerWall() {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleReact = async (prayerId, reactionType) => {
    try {
      await reactToPrayer(prayerId, reactionType);
      // The SSE will update the state
    } catch (err) {
      console.error("Reaction failed", err);
    }
  };

  useEffect(() => {
    const loadPrayers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPrayers();
        setPrayers(data);
      } catch (err) {
        setError("Failed to load prayers. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPrayers();

    // Set up SSE for real-time updates
    const token = localStorage.getItem("token");
    const eventSource = new EventSource(`${API_BASE_URL}/api/prayers/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ping') return; // Ignore ping

      setPrayers((prevPrayers) => {
        let updatedPrayers = [...prevPrayers];

        if (data.type === 'reaction_added' || data.type === 'reaction_removed' || data.type === 'reaction_updated') {
          // Update reaction counts for the specific prayer
          updatedPrayers = updatedPrayers.map((prayer) => {
            if (prayer.id === data.prayer_id) {
              const newReactions = { ...prayer.reactions };
              if (data.type === 'reaction_added') {
                newReactions[data.reaction] += 1;
              } else if (data.type === 'reaction_removed') {
                newReactions[data.reaction] = Math.max(0, newReactions[data.reaction] - 1);
              } else if (data.type === 'reaction_updated') {
                newReactions[data.old_reaction] = Math.max(0, newReactions[data.old_reaction] - 1);
                newReactions[data.new_reaction] += 1;
              }
              return { ...prayer, reactions: newReactions };
            }
            return prayer;
          });
        } else if (data.type === 'prayer_created') {
          // For new prayers, we might need to fetch or add, but since it's approved, perhaps refetch
          // For simplicity, refetch the list
          loadPrayers();
        } else if (data.type === 'prayer_deleted') {
          updatedPrayers = updatedPrayers.filter(p => p.id !== data.prayer_id);
        }

        return updatedPrayers;
      });
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      // Fallback to polling
      const interval = setInterval(loadPrayers, 5000);
      return () => clearInterval(interval);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Filter to show only approved prayers
  const approvedPrayers = prayers.filter(prayer => prayer.approved !== false);
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-[#B3B3B3]">
      {/* Header */}
      <div className="bg-[#6F4E37] text-white p-4 flex items-center">
        <h1 className="text-xl font-bold">🙏 Prayer Requests</h1>
      </div>

      {/* Header Description */}
      <div className="px-6 py-3">
        <p className="text-gray-600 dark:text-[#B3B3B3] text-sm">
          Pray for others or share your own request
        </p>
      </div>

      {/* Prayer List */}
      <div className="px-6 pb-24">
        {loading ? (
          <p className="text-center py-8">Loading prayers...</p>
        ) : error ? (
          <p className="text-center py-8 text-red-600">{error}</p>
        ) : approvedPrayers.length === 0 ? (
          <p className="text-center py-8">No approved prayers yet.</p>
        ) : (
          <div className="space-y-4">
            {approvedPrayers.map((prayer) => (
              <div
                key={prayer._id}
                className="bg-gray-50 dark:bg-[#181818] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {}}
              >
                <div className="flex flex-col">
                  <p className="font-semibold text-gray-800 dark:text-white">{prayer.anonymous ? "Anonymous" : prayer.userName}</p>
                  <p className="text-gray-700 dark:text-gray-200 mt-1">{prayer.requestText}</p>
                  <small className="text-gray-400 mt-2">
                    {new Date(prayer.createdAt).toLocaleString()}
                  </small>
                  <small className="text-green-600 mt-1 block">Approved</small>

                  {prayer.responses?.length > 0 && (
                    <div className="mt-3 space-y-1 pl-4 border-l-2 border-gray-200">
                      {prayer.responses.filter(res => res.approved !== false).map((res, idx) => (
                        <p key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                          <strong>{res.anonymous ? "Anonymous" : res.userName}:</strong> {res.responseText}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Reaction Buttons */}
                  <div className="flex gap-3 mt-3">
                    {REACTIONS.map(r => (
                      <button
                        key={r.type}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening details
                          handleReact(prayer.id, r.type);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          prayer.userReaction === r.type
                            ? "bg-[#6F4E37] text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {r.icon} {prayer.reactions?.[r.type] || 0}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <Link to="/users/prayer-wall/new">
        <button
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#6F4E37] hover:bg-[#5b3f2c] text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-colors z-10"
        >
          +
        </button>
      </Link>
    </div>
  );
}