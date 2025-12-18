import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserIcon, Cog6ToothIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on settings sub-pages (not the main settings page)
  const isSettingsSubPage = location.pathname.startsWith('/settings/') && location.pathname !== '/settings';

  // Check if we're on testimonials, prayer request, activities, or youth groups pages
  const isTestimonialsPage = location.pathname.includes('/testimonials');
  const isPrayerWallPage = location.pathname.includes('/prayer-wall');
  const isActivitiesPage = location.pathname.includes('/activities');
  const isYouthGroupsPage = location.pathname === '/youth-groups';

  return (
    <nav className="w-full shadow-md fixed top-0 left-0 z-40" style={{ backgroundColor: '#6F4E37' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Back button for settings sub-pages, testimonials/prayer pages, activities, and youth groups, Profile button otherwise */}
          {isSettingsSubPage || isTestimonialsPage || isPrayerWallPage || isActivitiesPage || isYouthGroupsPage ? (
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200 transition"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
          ) : (
            <Link to="/users/profile" className="text-white hover:text-gray-200 transition">
              <UserIcon className="h-6 w-6" />
            </Link>
          )}

          {/* Logo in the center */}
          <Link to="/" className="text-2xl font-bold text-white tracking-wide">
            Churchly
          </Link>

          {/* Settings on the right */}
          <div className="flex items-center space-x-3">
            <Link to="/users/settings" className="text-white hover:text-gray-200 transition">
              <Cog6ToothIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}