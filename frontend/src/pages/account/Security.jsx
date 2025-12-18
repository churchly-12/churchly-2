import { Shield, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Security() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Security</h1>

      <Link
        to="/account/change-password"
        className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md"
      >
        <div className="flex items-center gap-3">
          <Shield className="text-[#6b4a2d]" size={20} />
          <span className="font-medium">Change Password</span>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </Link>
    </div>
  );
}