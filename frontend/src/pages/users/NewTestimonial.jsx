import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postTestimony } from "../../services/testimonyService";

export default function NewTestimonial() {
  const navigate = useNavigate();
  const [story, setStory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async () => {
    if (!story.trim()) {
      alert("Please fill the testimony");
      return;
    }

    try {
      await postTestimony(story.trim(), isAnonymous);
      alert("Testimony posted successfully!");
      navigate("/users/testimonials");
    } catch (error) {
      console.error("Post testimony error:", error.response?.data || error);
      alert(JSON.stringify(error.response?.data, null, 2));
    }
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
          {/* Story Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Testimony
            </label>
            <textarea
              placeholder="Share what God has done in your life..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Post anonymously
            </label>
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