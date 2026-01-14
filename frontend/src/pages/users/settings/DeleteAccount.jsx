import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const navigate = useNavigate();

  const handleDelete = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">

      <div className="flex items-center gap-3 mb-4">
        <ArrowLeft size={22} onClick={() => navigate(-1)} className="cursor-pointer" />
        <h1 className="text-xl font-semibold text-red-600">Delete Account</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle size={24} />
          <p className="font-medium">This action is permanent.</p>
        </div>

        <p className="text-gray-700 mt-3">
          All your data will be removed. Are you sure you want to continue?
        </p>
      </div>

      <button
        onClick={handleDelete}
        className="mt-6 w-full bg-red-600 text-white p-3 rounded-xl"
      >
        Yes, Delete My Account
      </button>

    </div>
  );
}