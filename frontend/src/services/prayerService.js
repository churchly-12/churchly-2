import apiClient from "../api/apiClient";

const API_BASE = "/api/prayers";

export const fetchPrayers = async () => {
  try {
    const res = await apiClient.get(`${API_BASE}/`);
    return res.data.success ? res.data.data : [];
  } catch (err) {
    console.error("Failed to fetch prayers:", err);
    return [];
  }
};

export async function getPrayerById(id, params = '') {
  const res = await apiClient.get(`${API_BASE}/get/${id}${params}`);
  return res.data;
}

export async function postPrayerRequest(payload) {
  const res = await apiClient.post(`${API_BASE}/post`, payload);
  return res.data;
}

export async function respondToPrayer(id, payload) {
  const res = await apiClient.post(`${API_BASE}/respond/${id}`, payload);
  return res.data;
}

export async function fetchParishes() {
  try {
    const res = await apiClient.get("/users/parishes");
    return res.data.success ? res.data.data : [];
  } catch (err) {
    console.error("Failed to fetch parishes:", err);
    return [];
  }
}