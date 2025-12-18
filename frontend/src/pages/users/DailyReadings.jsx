import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function DailyReadingsPage() {
  const navigate = useNavigate();

  const readings = {
    firstReading: "In the beginning, God created the heavens and the earth...",
    psalm: "The Lord is my shepherd; I shall not want...",
    secondReading: "For God so loved the world that he gave his one and only Son...",
    gospel: "In the beginning was the Word, and the Word was with God..."
  };

  const readingSections = [
    { title: "First Reading", text: readings.firstReading },
    { title: "Psalm", text: readings.psalm },
    { title: "Second Reading", text: readings.secondReading },
    { title: "Gospel", text: readings.gospel },
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
            <h1 className="text-xl font-bold text-white tracking-wide">Daily Readings</h1>

            {/* Empty space for balance */}
            <div className="w-6"></div>
          </div>
        </div>
      </motion.nav>

      <h1 className="text-2xl font-bold text-center">Daily Readings</h1>
      <p className="text-center opacity-70 text-sm mt-1">Meditate on the Word of God</p>

      <div className="mt-6 space-y-4">
        {readingSections.map((section, index) => (
          <ReadingCard key={index} title={section.title} text={section.text} />
        ))}
      </div>
    </div>
  );
}

function ReadingCard({ title, text }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative bg-[#fdf5e6] rounded-xl shadow-lg p-5 border-l-8 border-[#c6ad92] transition-all duration-300 hover:shadow-xl hover:ring-1 hover:ring-[#c6ad92]">
      <button
        className="w-full flex justify-between items-center text-left font-semibold text-lg"
        onClick={() => setOpen(!open)}
      >
        {title} <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 text-sm leading-relaxed whitespace-pre-line"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}