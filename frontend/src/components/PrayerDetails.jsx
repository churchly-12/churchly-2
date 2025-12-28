import { useEffect, useState, useCallback } from "react";
import { getPrayerById, respondToPrayer } from "../services/prayerService";

export default function PrayerDetails({ prayerId }) {
  const [prayer, setPrayer] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [isVisible, setIsVisible] = useState(!document.hidden);

  // Function to fetch prayer details
  const fetchPrayer = useCallback(async () => {
    if (!isVisible) return; // Skip if not visible

    try {
      setError(null);
      const params = lastFetchedAt ? `?since=${lastFetchedAt}` : '';
      const data = await getPrayerById(prayerId, params);
      if (data.success) {
        setPrayer(data.prayer);
        setLoading(false);
        setLastFetchedAt(new Date().toISOString());
      } else {
        setError("Failed to load prayer details.");
      }
    } catch (err) {
      setError("Failed to load prayer details.");
      console.error(err);
    }
  }, [prayerId, lastFetchedAt, isVisible]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Auto-refresh every 5 seconds when visible
  useEffect(() => {
    if (!isVisible) return;

    fetchPrayer(); // initial fetch
    const interval = setInterval(fetchPrayer, 5000); // every 5 sec

    return () => clearInterval(interval); // cleanup on unmount
  }, [prayerId, fetchPrayer, isVisible]);

  const handleResponseSubmit = async () => {
    if (!responseText.trim()) return;

    try {
      const newResponse = await respondToPrayer(prayerId, {
        userId: "user_005", // replace with auth userId
        userName: "Sarah",  // replace with auth username
        responseText,
      });

      setPrayer((prev) => ({
        ...prev,
        responses: [...prev.responses, newResponse.response],
      }));

      setResponseText("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading prayer...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="font-semibold">{prayer.anonymous ? "Anonymous" : prayer.userName}</h2>
        <p>{prayer.requestText}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Responses</h3>
        {prayer.responses.filter(r => r.approved !== false).length === 0 ? (
          <p>No approved responses yet</p>
        ) : (
          prayer.responses.filter(r => r.approved !== false).map((r, i) => (
            <div
              key={i}
              className="bg-gray-100 p-2 rounded-lg flex justify-between"
            >
              <span>{r.anonymous ? "Anonymous" : r.userName}: {r.responseText}</span>
              <span className="text-xs text-gray-400">
                {new Date(r.time).toLocaleTimeString()}
              </span>
              <small className="text-green-600 text-xs">Approved</small>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Add your response..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={handleResponseSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}