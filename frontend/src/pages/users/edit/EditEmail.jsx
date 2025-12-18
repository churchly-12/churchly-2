import { ChevronLeft, Mail } from "lucide-react";
import { useState } from "react";

export default function EditEmail() {
  const [email, setEmail] = useState("john@example.com");

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <ChevronLeft size={24} className="text-gray-600" />
        <h1 className="text-xl font-bold text-gray-900">Edit Email</h1>
      </div>

      <label className="block text-gray-700 font-medium">Email Address</label>
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md border">
        <Mail size={20} className="text-[#6b4a2d]" />
        <input
          type="email"
          className="w-full outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button className="w-full bg-[#6b4a2d] text-white p-3 rounded-xl font-semibold">
        Save Changes
      </button>
    </div>
  );
}