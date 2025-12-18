import { DAILY_VERSES } from "../constants/dailyVerses";

export function getTodayVerseReference() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );

  const index = dayOfYear % DAILY_VERSES.length;
  return DAILY_VERSES[index]; // ex: "John 3:16"
}