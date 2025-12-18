import React, { useEffect, useState } from "react";
import { getTodayVerseReference } from "../utils/verseHelpers";
import { fetchDailyVerse } from "../utils/fetchVerse";

export default function DailyVerseCard() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVerse() {
      const todayRef = getTodayVerseReference();
      const data = await fetchDailyVerse(todayRef);
      setVerse(data);
      setLoading(false);
    }

    loadVerse();
  }, []);

  if (loading) {
    return (
      <div className="p-6 mx-4 mt-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-4 mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">
        Daily Verse
      </h3>

      <p className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-200">
        {verse.reference}
      </p>

      <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300 mb-3">
        {verse.text}
      </p>

      {verse.version && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          — {verse.version}
        </p>
      )}
    </div>
  );
}