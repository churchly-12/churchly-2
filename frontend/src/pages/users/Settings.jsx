import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  IdCard,
  Shield,
  Bell,
  ChevronRight,
  Trash2,
  LogOut,
  AlertTriangle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SettingsPage() {
  const personalInfo = [
    { label: "Full Name", value: "John Christopher", icon: <User size={20} /> },
    { label: "Email", value: "john@example.com", icon: <Mail size={20} /> },
    { label: "Mobile Number", value: "+91 98765 43210", icon: <Phone size={20} /> },
    { label: "Date of Birth", value: "15 Aug 1999", icon: <Calendar size={20} /> },
    { label: "Address", value: "Chennai, India", icon: <MapPin size={20} /> },
  ];

  const parishInfo = [
    { label: "Family ID", value: "FAM-1274", icon: <IdCard size={20} /> },
    { label: "Community / Zone", value: "St. Joseph Community", icon: <Users size={20} /> },
  ];

  const security = [
    { label: "Change Password", icon: <Shield size={20} /> },
  ];

  const preferences = [
    { label: "Notifications", value: "Enabled", icon: <Bell size={20} /> },
    { label: "My Testimonials", icon: <User size={20} /> },
  ];

  return (
    <div className="p-4 space-y-8">

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">
        Settings
      </h1>

      {/* PERSONAL INFO */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-[#6b4a2d]">
          Personal Information
        </h2>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200">
          {personalInfo.map((item, i) => {
            const editRoutes = {
              "Full Name": "/users/settings/edit-name",
              "Email": "/users/settings/edit-email",
              "Mobile Number": "/users/settings/edit-phone",
              "Date of Birth": "/users/settings/edit-dob",
              "Address": "/users/settings/edit-address"
            };

            return (
              <Link
                key={i}
                to={editRoutes[item.label]}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#f7efe6] text-[#6b4a2d]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{item.label}</p>
                    <p className="text-gray-500 text-sm">{item.value}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* PARISH INFO */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-[#6b4a2d]">
          Parish Information
        </h2>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200">
          {parishInfo.map((item, i) => {
            const editRoutes = {
              "Family ID": "/users/settings/family-id",
              "Community / Zone": "/users/settings/community-zone",
              "My Testimonials": "/users/settings/my-testimonials"
            };

            return (
              <Link
                key={i}
                to={editRoutes[item.label]}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#f7efe6] text-[#6b4a2d]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{item.label}</p>
                    <p className="text-gray-500 text-sm">{item.value}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECURITY */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-[#6b4a2d]">
          Security
        </h2>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200">
          {security.map((item, i) => (
            <Link
              key={i}
              to="/users/settings/change-password"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#f7efe6] text-[#6b4a2d]">
                  {item.icon}
                </div>
                <span className="text-gray-900 font-medium">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </Link>
          ))}
        </div>
      </section>

      {/* PREFERENCES */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-[#6b4a2d]">
          Preferences
        </h2>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200">
          {preferences.map((item, i) => (
            <Link
              key={i}
              to="/users/settings/notifications"
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#f7efe6] text-[#6b4a2d]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">{item.label}</p>
                  <p className="text-gray-500 text-sm">{item.value}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </Link>
          ))}
        </div>
      </section>

      {/* HELP & SUPPORT */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-[#6b4a2d]">
          Help & Support
        </h2>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200">

          {/* Contact Support */}
          <Link
            to="/users/settings/contact-support"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#f7efe6] text-[#6b4a2d]">
                <Mail size={20} />
              </div>
              <span className="text-gray-900 font-medium">Contact Support</span>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </Link>

          {/* Report a Problem */}
          <Link
            to="/users/settings/report-problem"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#f7efe6] text-[#6b4a2d]">
                <AlertTriangle size={20} />
              </div>
              <span className="text-gray-900 font-medium">Report a Problem</span>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </Link>

        </div>
      </section>

      {/* DELETE ACCOUNT */}
      <Link
        to="/users/settings/delete-account"
        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-md border border-red-300/40 hover:bg-red-50 transition"
      >
        <div className="flex items-center gap-3 text-red-600">
          <Trash2 size={20} />
          <span className="font-semibold">Delete My Account</span>
        </div>
        <ChevronRight size={20} className="text-red-400" />
      </Link>

      {/* LOGOUT */}
      <Link
        to="/users/settings/logout"
        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-md hover:bg-red-50 transition border border-red-300/30"
      >
        <div className="flex items-center gap-3 text-red-600">
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </div>
        <ChevronRight size={20} className="text-red-400" />
      </Link>
    </div>
  );
}