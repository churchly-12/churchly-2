export async function fetchDailyVerse(verseRef) {
  const cacheKey = `dailyVerse_${verseRef}`;
  const cache = localStorage.getItem(cacheKey);

  if (cache) {
    const { data, timestamp } = JSON.parse(cache);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (now - timestamp < oneDay) {
      return data;
    }
  }

  try {
    const formattedRef = encodeURIComponent(verseRef);
    const url = `https://bible-api.com/${formattedRef}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("API error");
    }

    const apiData = await response.json();

    const data = {
      reference: apiData.reference,
      text: apiData.text.trim(),
      version: apiData.translation_name,
    };

    // Cache the data
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));

    return data;
  } catch (error) {
    // fallback — app never breaks
    return {
      reference: verseRef,
      text: "Unable to load verse. Please try again later.",
      version: "",
    };
  }
}