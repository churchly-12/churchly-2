export default function ChangePassword() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Change Password</h1>

      <input type="password" placeholder="Current Password" className="w-full p-3 border rounded-xl" />
      <input type="password" placeholder="New Password" className="w-full p-3 border rounded-xl" />
      <input type="password" placeholder="Confirm New Password" className="w-full p-3 border rounded-xl" />

      <button className="w-full bg-[#6b4a2d] text-white py-3 rounded-xl">
        Update Password
      </button>
    </div>
  );
}