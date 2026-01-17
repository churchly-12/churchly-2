import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postPrayerRequest } from "../../services/prayerService";
import { useAuth } from "../../context/AuthContext";

export default function NewPrayerRequest() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async () => {
    const titleTrim = title.trim();
    const detailsTrim = details.trim();
    if (!titleTrim || !detailsTrim) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        title: titleTrim,
        content: detailsTrim,
        is_anonymous: isAnonymous,
      };

      const res = await postPrayerRequest(payload);
      if (res.success) {
        setShowSuccessModal(true);
      } else {
        alert("Failed to submit prayer request: " + (res.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Prayer submit error:", err);
      const message =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to submit prayer request";
      alert("Failed to submit prayer request: " + message);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-[#B3B3B3]">
      {/* Header */}
      <div className="bg-[#6F4E37] text-white p-4 flex items-center">
        <h1 className="text-xl font-bold">Create Prayer Request</h1>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Eg: Pray for my exams"
              autoFocus
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Details Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Write your prayer request..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Submit anonymously
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#6F4E37] hover:bg-[#5b3f2c] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Submit Prayer Request
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-4">✓</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Success!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your prayer request has been submitted successfully.</p>
              <button
                onClick={() => navigate("/users/prayer-wall")}
                className="w-full bg-[#6F4E37] hover:bg-[#5b3f2c] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Back to Prayer Wall
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}