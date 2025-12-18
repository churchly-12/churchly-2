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
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AccountSettings() {
  const personalInfo = [
    { label: "Full Name", value: "John Christopher", icon: <User size={20} />, path: "personal-info" },
    { label: "Email", value: "john@example.com", icon: <Mail size={20} />, path: "personal-info" },
    { label: "Mobile Number", value: "+91 98765 43210", icon: <Phone size={20} />, path: "personal-info" },
    { label: "Date of Birth", value: "15 Aug 1999", icon: <Calendar size={20} />, path: "personal-info" },
    { label: "Address", value: "Chennai, India", icon: <MapPin size={20} />, path: "personal-info" },
  ];

  const parishInfo = [
    { label: "Family ID", value: "FAM-1274", icon: <IdCard size={20} />, path: "parish-info" },
    { label: "Community / Zone", value: "St. Joseph Community", icon: <Users size={20} />, path: "parish-info" },
  ];

  const security = [
    { label: "Change Password", icon: <Shield size={20} />, path: "security" },
  ];

  const preferences = [
    { label: "Notifications", value: "Enabled", icon: <Bell size={20} />, path: "preferences" },
  ];

  return (
    <div className="p-4 space-y-8">

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">
        Account Settings
      </h1>

      {/* PERSONAL INFO */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-[#6b4a2d]">
          Personal Information
        </h2>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200">
          {personalInfo.map((item, i) => (
            <Link
              key={i}
              to={`/account/${item.path}`}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
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

      {/* PARISH INFO */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-[#6b4a2d]">
          Parish Information
        </h2>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200">
          {parishInfo.map((item, i) => (
            <Link
              key={i}
              to={`/account/${item.path}`}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
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

      {/* SECURITY */}
      <section>
        <h2 className="text-lg font-semibold mb-2 text-[#6b4a2d]">
          Security
        </h2>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200">
          {security.map((item, i) => (
            <Link
              key={i}
              to={`/account/${item.path}`}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
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
              to={`/account/${item.path}`}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
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

      {/* DELETE ACCOUNT */}
      <Link
        to="/account/delete-account"
        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-md border border-red-300/40 hover:bg-red-50 transition"
      >
        <div className="flex items-center gap-3 text-red-600">
          <Trash2 size={20} />
          <span className="font-semibold">Delete My Account</span>
        </div>
        <ChevronRight size={20} className="text-red-400" />
      </Link>
    </div>
  );
}