import { Pencil } from "lucide-react";

export default function UserProfileSummary() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">

      {/* Profile Photo */}
      <img
        src="/images/user-placeholder.jpg"
        alt="User Profile"
        className="w-20 h-20 rounded-full object-cover border border-gray-300"
      />

      {/* User Info */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900">
          John Carvalho
        </h2>
        <p className="text-gray-600 text-sm">
          john@example.com
        </p>
        <p className="text-gray-600 text-sm">
          +91 98765 43210
        </p>
      </div>

      {/* Edit Button */}
      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
        <Pencil size={20} className="text-gray-700" />
      </button>
    </div>
  );
}