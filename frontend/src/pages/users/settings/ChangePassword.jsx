import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleSave = () => {
    if (newPwd !== confirmPwd) {
      alert("New passwords do not match!");
      return;
    }
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft size={22} onClick={() => navigate(-1)} className="cursor-pointer" />
        <h1 className="text-xl font-semibold">Change Password</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md space-y-4">
        <div>
          <label className="text-sm text-gray-600">Current Password</label>
          <input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            className="mt-1 w-full p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">New Password</label>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            className="mt-1 w-full p-3 border rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Confirm New Password</label>
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            className="mt-1 w-full p-3 border rounded-xl"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-5 w-full bg-[#6b4a2d] text-white p-3 rounded-xl"
      >
        Update Password
      </button>
    </div>
  );
}