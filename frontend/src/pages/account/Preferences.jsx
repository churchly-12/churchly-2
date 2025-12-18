import { Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Preferences() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Preferences</h1>

      <Link
        to="/account/notifications"
        className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md"
      >
        <div className="flex items-center gap-3">
          <Bell className="text-[#6b4a2d]" size={20} />
          <div>
            <p className="font-medium">Notifications</p>
            <p className="text-gray-500 text-sm">Enabled</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </Link>
    </div>
  );
}