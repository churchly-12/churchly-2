import apiClient from "../api/apiClient";

const API_BASE = "/api/testimonies";

export const fetchTestimonies = async () => {
  try {
    const res = await apiClient.get(`${API_BASE}/`);
    return res.data.success ? res.data.data : [];
  } catch (err) {
    console.error("Failed to fetch testimonies:", err);
    return [];
  }
};

export async function postTestimony(content, isAnonymous = false) {
  const res = await apiClient.post(`${API_BASE}/post`, { content, is_anonymous: isAnonymous });
  return res.data;
}

export async function getTestimonyById(id) {
  const res = await apiClient.get(`${API_BASE}/${id}`);
  return res.data.testimony;
}

export async function reactToTestimony(id, reaction) {
  const res = await apiClient.post(`${API_BASE}/react/${id}`, { reaction });
  return res.data;
}

export const fetchMyTestimonies = async () => {
  try {
    const res = await apiClient.get(`${API_BASE}/my`);
    return res.data.success ? res.data.data : [];
  } catch (err) {
    console.error("Failed to fetch my testimonies:", err);
    return [];
  }
};

export async function deleteTestimony(id) {
  const res = await apiClient.delete(`${API_BASE}/${id}`);
  return res.data;
}