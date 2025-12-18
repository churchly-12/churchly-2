import { ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft size={22} onClick={() => navigate(-1)} className="cursor-pointer" />
        <h1 className="text-xl font-semibold">Logout</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md text-center">
        <LogOut size={40} className="mx-auto text-gray-700 mb-3" />
        <p className="text-gray-700">Are you sure you want to logout?</p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-[#6b4a2d] text-white p-3 rounded-xl"
      >
        Logout
      </button>

    </div>
  );
}