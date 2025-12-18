import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTestimonialById, updateTestimonial } from "../../utils/testimonialStorage";

export default function TestimonialDetails() {
  const { id } = useParams();
  const [testimonial, setTestimonial] = useState(null);
  const [response, setResponse] = useState("");

  // Quick praise responses
  const quickReplies = [
    "Amen 🙏",
    "Praise God! ✨",
    "God is good 🙌",
    "Congratulations 🎉",
    "So happy for you ❤️",
    "Blessings to you ✝️",
  ];

  useEffect(() => {
    const item = getTestimonialById(id);
    setTestimonial(item);
  }, [id]);

  if (!testimonial) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-[#B3B3B3] p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!response.trim()) return;

    const newResponse = {
      id: Date.now(),
      text: response,
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...testimonial,
      responses: [...testimonial.responses, newResponse],
    };

    updateTestimonial(updated);
    setTestimonial(updated);
    setResponse("");
  };

  const handleQuickReply = (text) => {
    setResponse(text);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-[#B3B3B3]">
      {/* Header */}
      <div className="bg-[#6F4E37] text-white p-4 flex items-center">
        <h1 className="text-xl font-bold">✨ Testimonial</h1>
      </div>

      {/* Testimonial Content */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-6 border border-yellow-200 dark:border-yellow-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            {testimonial.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
            {testimonial.story}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Shared on {new Date(testimonial.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Responses Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Responses ({testimonial.responses?.length || 0})
          </h3>

          {testimonial.responses?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-2">No responses yet.</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to share your praise!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testimonial.responses.map((r) => (
                <div
                  key={r.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-gray-700 dark:text-gray-200 mb-2">{r.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Replies */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
            Quick Replies:
          </h4>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((q, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(q)}
                className="bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-full text-sm font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Response Input */}
        <div className="space-y-4">
          <textarea
            placeholder="Write a response..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
          />

          <button
            onClick={handleSend}
            disabled={!response.trim()}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Send Response
          </button>
        </div>
      </div>
    </div>
  );
}