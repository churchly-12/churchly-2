import { Trash2 } from "lucide-react";

export default function DeleteAccount() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-red-600">Delete Account</h1>

      <p className="text-gray-600">
        This action cannot be undone. All your data will be permanently erased.
      </p>

      <button className="w-full bg-red-600 text-white py-3 rounded-xl">
        Yes, Delete My Account
      </button>
    </div>
  );
}