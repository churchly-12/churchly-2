import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postPrayerRequest } from "../../services/prayerService";

export default function NewPrayerRequest() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !details.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        userId: "user_001",
        userName: "John Christopher",
        requestText: `${title}: ${details}`,
      };

      const res = await postPrayerRequest(payload);
      console.log(res.data); // check the response
      if (res.success) {
        alert("Prayer request submitted!");
        navigate("/prayer-wall");
      } else {
        alert("Failed to submit prayer request");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit prayer request");
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
              placeholder="Eg: Pray for my exams"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Details Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Details
            </label>
            <textarea
              placeholder="Write your prayer request..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
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
    </div>
  );
}