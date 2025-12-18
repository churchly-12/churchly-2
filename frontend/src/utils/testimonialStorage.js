const KEY = "testimonials";

export function getTestimonials() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function addTestimonial(item) {
  const existing = getTestimonials();
  const updated = [...existing, item];
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getTestimonialById(id) {
  return getTestimonials().find(t => t.id == id);
}

export function updateTestimonial(updatedItem) {
  const items = getTestimonials();
  const newList = items.map(t =>
    t.id === updatedItem.id ? updatedItem : t
  );

  localStorage.setItem(KEY, JSON.stringify(newList));
}