import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function AdminTopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if we're on admin sub-pages (not the main admin landing page)
  const isAdminSubPage = location.pathname !== '/admin' && location.pathname.startsWith('/admin');

  return (
    <nav className="w-full shadow-md fixed top-0 left-0 z-40 bg-gradient-to-r from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex items-center h-16">
          {/* Left side: Back arrow for admin sub-pages */}
          <div className="flex items-center">
            {isAdminSubPage && (
              <button
                onClick={() => navigate('/admin')}
                className="text-white hover:text-gray-200 transition p-2 rounded-md hover:bg-slate-700"
                title="Back to Admin"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Center: Admin Portal Title - absolutely centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Churchly Admin
            </h1>
          </div>

          {/* Right side: Settings */}
          <div className="flex items-center ml-auto">
            <Link
              to="/admin/settings"
              className="text-white hover:text-gray-200 transition p-2 rounded-md hover:bg-slate-700"
              title="Admin Settings"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}