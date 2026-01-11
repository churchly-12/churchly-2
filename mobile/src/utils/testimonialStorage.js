import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = "testimonials";

export async function getTestimonials() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function addTestimonial(item) {
  const existing = await getTestimonials();
  const updated = [...existing, item];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function getTestimonialById(id) {
  const testimonials = await getTestimonials();
  return testimonials.find(t => t.id == id);
}

export async function updateTestimonial(updatedItem) {
  const items = await getTestimonials();
  const newList = items.map(t =>
    t.id === updatedItem.id ? updatedItem : t
  );

  await AsyncStorage.setItem(KEY, JSON.stringify(newList));
}