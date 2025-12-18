import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

export default function AdminLanding() {
  const navigate = useNavigate();

  const adminOptions = [
    {
      title: "User Management",
      description: "Manage user accounts, permissions, and access",
      icon: UserGroupIcon,
      path: "/admin/users",
      color: "blue"
    },
    {
      title: "Role Management",
      description: "Configure roles and permissions",
      icon: ShieldCheckIcon,
      path: "/admin/roles",
      color: "emerald"
    },
    {
      title: "Prayer Management",
      description: "Moderate and manage prayer requests",
      icon: ChatBubbleLeftRightIcon,
      path: "/admin/prayers",
      color: "violet"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-600 mt-2">Choose an area to manage</p>
        </div>
      </div>

      {/* Admin Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminOptions.map((option) => {
          const IconComponent = option.icon;
          const colorClasses = {
            blue: {
              bg: "bg-blue-50",
              icon: "text-blue-600",
              hover: "hover:bg-blue-100 hover:border-blue-300"
            },
            emerald: {
              bg: "bg-emerald-50",
              icon: "text-emerald-600",
              hover: "hover:bg-emerald-100 hover:border-emerald-300"
            },
            violet: {
              bg: "bg-violet-50",
              icon: "text-violet-600",
              hover: "hover:bg-violet-100 hover:border-violet-300"
            },
            indigo: {
              bg: "bg-indigo-50",
              icon: "text-indigo-600",
              hover: "hover:bg-indigo-100 hover:border-indigo-300"
            }
          };

          const colors = colorClasses[option.color];

          return (
            <button
              key={option.path}
              onClick={() => navigate(option.path)}
              className={`bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200 transition-all duration-200 text-left ${colors.hover}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats or Info */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">3</div>
            <div className="text-sm text-slate-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">1</div>
            <div className="text-sm text-slate-600">Active Parishes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">0</div>
            <div className="text-sm text-slate-600">Pending Prayers</div>
          </div>
        </div>
      </div>
    </div>
  );
}