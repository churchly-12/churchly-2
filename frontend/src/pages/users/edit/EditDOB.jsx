import { ChevronLeft, Calendar } from "lucide-react";
import { useState } from "react";

export default function EditDOB() {
  const [dob, setDob] = useState("1999-08-15");

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <ChevronLeft size={24} className="text-gray-600" />
        <h1 className="text-xl font-bold text-gray-900">Edit Date of Birth</h1>
      </div>

      <label className="block text-gray-700 font-medium">Date of Birth</label>
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-md border">
        <Calendar size={20} className="text-[#6b4a2d]" />
        <input
          type="date"
          className="w-full outline-none"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>

      <button className="w-full bg-[#6b4a2d] text-white p-3 rounded-xl font-semibold">
        Save Changes
      </button>
    </div>
  );
}