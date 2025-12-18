import { useEffect, useState } from "react";
import { getPrayerById, respondToPrayer } from "../services/prayerService";

export default function PrayerDetails({ prayerId }) {
  const [prayer, setPrayer] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to fetch prayer details
  const fetchPrayer = async () => {
    try {
      const data = await getPrayerById(prayerId);
      if (data.success) {
        setPrayer(data.prayer);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchPrayer(); // initial fetch
    const interval = setInterval(fetchPrayer, 5000); // every 5 sec

    return () => clearInterval(interval); // cleanup on unmount
  }, [prayerId]);

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

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="font-semibold">{prayer.userName}</h2>
        <p>{prayer.requestText}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Responses</h3>
        {prayer.responses.length === 0 ? (
          <p>No responses yet</p>
        ) : (
          prayer.responses.map((r, i) => (
            <div
              key={i}
              className="bg-gray-100 p-2 rounded-lg flex justify-between"
            >
              <span>{r.userName}: {r.responseText}</span>
              <span className="text-xs text-gray-400">
                {new Date(r.time).toLocaleTimeString()}
              </span>
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