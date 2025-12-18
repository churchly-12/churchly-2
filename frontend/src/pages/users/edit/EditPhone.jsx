import { ChevronLeft, Phone } from "lucide-react";
import { useState } from "react";

export default function EditPhone() {
  const [phone, setPhone] = useState("+91 98765 43210");

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <ChevronLeft size={24} className="text-gray-600" />
        <h1 className="text-xl font-bold text-gray-900">Edit Mobile Number</h1>
      </div>

      <label className="block text-gray-700 font-medium">Mobile Number</label>
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md border">
        <Phone size={20} className="text-[#6b4a2d]" />
        <input
          type="text"
          className="w-full outline-none"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button className="w-full bg-[#6b4a2d] text-white p-3 rounded-xl font-semibold">
        Save Changes
      </button>
    </div>
  );
}