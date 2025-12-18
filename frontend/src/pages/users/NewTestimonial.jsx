import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { addTestimonial } from "../../utils/testimonialStorage";

export default function NewTestimonial() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !story.trim()) {
      alert("Please fill all fields");
      return;
    }

    addTestimonial({
      id: Date.now(),
      title: title.trim(),
      story: story.trim(),
      responses: [],
      createdAt: new Date().toISOString(),
    });

    navigate("/testimonials");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-[#B3B3B3]">
      {/* Header */}
      <div className="bg-[#6F4E37] text-white p-4 flex items-center">
        <h1 className="text-xl font-bold">Share Testimony ✨</h1>
      </div>

      {/* Form */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Eg: God healed my family"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* Story Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Story
            </label>
            <textarea
              placeholder="Share what God has done in your life..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Post Testimony
          </button>
        </div>
      </div>
    </div>
  );
}