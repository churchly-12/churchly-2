export default function Notifications() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>

      <label className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md">
        <span className="font-medium">Enable Notifications</span>
        <input type="checkbox" defaultChecked className="h-5 w-5" />
      </label>
    </div>
  );
}