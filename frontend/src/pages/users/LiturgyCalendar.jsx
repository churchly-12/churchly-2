import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function LiturgyCalendarPage() {
  const navigate = useNavigate();

  const liturgicalSeasons = [
    { name: "Advent", period: "November 30 - December 24", color: "bg-blue-100" },
    { name: "Christmas", period: "December 25 - January 6", color: "bg-green-100" },
    { name: "Ordinary Time", period: "After Epiphany - Ash Wednesday", color: "bg-gray-100" },
    { name: "Lent", period: "Ash Wednesday - Holy Thursday", color: "bg-purple-100" },
    { name: "Easter Triduum", period: "Holy Thursday - Easter Sunday", color: "bg-red-100" },
    { name: "Easter", period: "Easter Sunday - Pentecost", color: "bg-yellow-100" },
    { name: "Ordinary Time", period: "After Pentecost - Advent", color: "bg-gray-100" }
  ];

  const upcomingFeasts = [
    "Immaculate Conception (December 8)",
    "Christmas (December 25)",
    "Epiphany (January 6)",
    "Ash Wednesday (February)",
    "Palm Sunday (March/April)",
    "Easter (March/April)",
    "Pentecost (May/June)"
  ];

  return (
    <div className="min-h-screen bg-[#f5e8d8] text-[#3a2c1a] px-4 pt-16 py-6">

      {/* Custom Top Bar */}
      <motion.nav
        className="w-full shadow-md fixed top-0 left-0 z-40"
        style={{ backgroundColor: '#6F4E37' }}
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200 transition flex items-center"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            {/* Title in the center */}
            <h1 className="text-xl font-bold text-white tracking-wide">Liturgy Calendar</h1>

            {/* Empty space for balance */}
            <div className="w-6"></div>
          </div>
        </div>
      </motion.nav>

      <h1 className="text-2xl font-bold text-center">Liturgy Calendar</h1>
      <p className="text-center opacity-70 text-sm mt-1">Liturgical seasons and feast days</p>

      <div className="mt-6 space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Liturgical Seasons</h2>
          <div className="space-y-2">
            {liturgicalSeasons.map((season, index) => (
              <div key={index} className={`p-3 rounded-lg ${season.color}`}>
                <div className="font-medium">{season.name}</div>
                <div className="text-sm opacity-70">{season.period}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Upcoming Feast Days</h2>
          <ul className="space-y-2">
            {upcomingFeasts.map((feast, index) => (
              <li key={index} className="text-sm">• {feast}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}