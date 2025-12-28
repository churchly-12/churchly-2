import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";

export default function DeleteAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const deleteAccount = async () => {
    if (!window.confirm("This will permanently delete your account")) return;

    await apiClient.delete("/users/me");
    logout();
    navigate("/signup");
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-red-600">Delete Account</h1>

      <p className="text-gray-600">
        This action cannot be undone. All your data will be permanently erased.
      </p>

      <button
        onClick={deleteAccount}
        className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
      >
        Yes, Delete My Account
      </button>
    </div>
  );
}