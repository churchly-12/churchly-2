import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  SparklesIcon,
  CalendarDaysIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default function BottomNav() {
  return (
    <nav className="
      fixed bottom-0 w-full
      bg-white text-gray-700
      border-t border-gray-200
      shadow-lg
    ">
      <div className="flex justify-around items-center py-2">

        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-green-600 font-semibold" : "text-gray-600"
            }`
          }
        >
          <HomeIcon className="h-6 w-6 mb-1" />
          Home
        </NavLink>

        {/* Devotions */}
        <NavLink
          to="/users/devotions"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-green-600 font-semibold" : "text-gray-600"
            }`
          }
        >
          <SparklesIcon className="h-6 w-6 mb-1" />
          Devotions
        </NavLink>

        {/* Activities */}
        <NavLink
          to="/users/activities"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-green-600 font-semibold" : "text-gray-600"
            }`
          }
        >
          <CalendarDaysIcon className="h-6 w-6 mb-1" />
          Activities
        </NavLink>

        {/* Community */}
        <NavLink
          to="/users/community"
          className={({ isActive }) =>
            `flex flex-col items-center text-xs ${
              isActive ? "text-green-600 font-semibold" : "text-gray-600"
            }`
          }
        >
          <UsersIcon className="h-6 w-6 mb-1" />
          Community
        </NavLink>
      </div>
    </nav>
  );
}