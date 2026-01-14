import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    notifications: user?.notifications_enabled || true,
    theme: user?.theme || 'system',
    language: user?.language || 'en'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Admin settings updated successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Settings</h1>
        <p className="text-slate-600">Configure your admin portal preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Notification Settings</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-slate-700">
                  Enable admin notifications
                </label>
              </div>
            </div>

            {/* Theme Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Theme Settings</h3>
              <div className="space-y-2">
                <label htmlFor="theme" className="block text-sm font-medium text-slate-700">
                  Portal Theme
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="system">System Default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            {/* Language Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Language Settings</h3>
              <div className="space-y-2">
                <label htmlFor="language" className="block text-sm font-medium text-slate-700">
                  Portal Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>

      {/* Admin Info */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Admin Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Admin Name</p>
            <p className="font-medium text-slate-900">{user?.full_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-medium text-slate-900">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Role</p>
            <p className="font-medium text-slate-900">{user?.role || 'Administrator'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Last Login</p>
            <p className="font-medium text-slate-900">{user?.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* LOGOUT */}
      <Link
        to="/admin/logout"
        className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-red-300/30 hover:bg-red-50 transition"
      >
        <div className="flex items-center gap-3 text-red-600">
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </div>
      </Link>
    </div>
  );
}