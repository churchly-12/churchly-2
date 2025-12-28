import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function AdminBottomNav() {
  return (
    <nav className="
      fixed bottom-0 w-full
      bg-white text-gray-700
      border-t border-gray-200
      shadow-lg
      z-50
    ">
      <div className="flex justify-around items-center py-2">

        {/* Home/Dashboard */}
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-600"
            }`
          }
        >
          <HomeIcon className="h-6 w-6 mb-1" />
          Home
        </NavLink>

        {/* Users */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-600"
            }`
          }
        >
          <UsersIcon className="h-6 w-6 mb-1" />
          Users
        </NavLink>

        {/* Activities */}
        <NavLink
          to="/admin/activities"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-600"
            }`
          }
        >
          <CalendarDaysIcon className="h-6 w-6 mb-1" />
          Activities
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-600"
            }`
          }
        >
          <Cog6ToothIcon className="h-6 w-6 mb-1" />
          Settings
        </NavLink>
      </div>
    </nav>
  );
}