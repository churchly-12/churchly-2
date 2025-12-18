const API_BASE = "http://127.0.0.1:8008/api/prayers";

export const fetchPrayers = async () => {
  try {
    const res = await fetch(`${API_BASE}/`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (err) {
    console.error("Failed to fetch prayers:", err);
    return [];
  }
};

export async function getPrayerById(id) {
  const res = await fetch(`${API_BASE}/get/${id}`);
  return res.json();
}

export async function postPrayerRequest(payload) {
  const res = await fetch(`${API_BASE}/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function respondToPrayer(id, payload) {
  const res = await fetch(`${API_BASE}/respond/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}