import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";

export default function Meditation() {
  const [devotions, setDevotions] = useState([]);

  useEffect(() => {
    fetchDevotions();
  }, []);

  const fetchDevotions = async () => {
    try {
      const res = await apiClient.get("/content/devotions");
      setDevotions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 min-h-screen px-4 py-4
      bg-white dark:bg-[#121212]
      text-gray-900 dark:text-[#B3B3B3]
    ">
      <h2 className="text-3xl font-semibold text-center mb-6 dark:text-white">Daily Devotions</h2>

      {devotions.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-[#B3B3B3]">No devotions available.</p>
      ) : (
        <div className="grid gap-4">
          {devotions.map((devotion) => (
            <div
              key={devotion.id}
              className="bg-white dark:bg-[#181818] rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-medium dark:text-white">{devotion.title}</h3>
              <p className="text-gray-600 dark:text-[#B3B3B3] mt-1">Duration: {devotion.duration}</p>
              {devotion.description && <p className="mt-2 text-gray-700 dark:text-[#B3B3B3]">{devotion.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
