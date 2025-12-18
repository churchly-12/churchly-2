import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function DivineMercyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5e8d8] text-[#3a2c1a] px-4 pt-24 py-6 relative overflow-hidden">

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
            <h1 className="text-xl font-bold text-white tracking-wide">Divine Mercy Chaplet</h1>

            {/* Empty space for balance */}
            <div className="w-6"></div>
          </div>
        </div>
      </motion.nav>

      {/* Swinging Cross */}
      <motion.div
        initial={{ rotate: -3 }}
        animate={{ rotate: [3, -3, 3] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="flex justify-center mb-6"
      >
        <svg width="64" height="80" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 opacity-90">
          <rect x="7.5" y="1" width="3" height="20" rx="1.5" fill="#6b4a2d"/>
          <rect x="1" y="9" width="16" height="3" rx="1.5" fill="#6b4a2d"/>
        </svg>
      </motion.div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center">Divine Mercy Chaplet</h1>
      <p className="text-center opacity-80 text-sm mt-1">“Have mercy on us and on the whole world.”</p>

      {/* Intro */}
      <SectionCard title="Intro">
        <p>You expired, Jesus, but the source of life gushed forth for souls…</p>
        <p>O Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You.</p>
      </SectionCard>

      {/* Opening Prayers */}
      <SectionCard title="Opening Prayers">
        <p>Our Father…</p>
        <p>Hail Mary…</p>
        <p>The Apostles’ Creed…</p>
      </SectionCard>

      {/* Chaplet Text (No instructions, no guiding) */}
      <SectionCard title="The Chaplet">
        <p>Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, our Lord Jesus Christ…</p>
        <p>For the sake of His sorrowful Passion, have mercy on us and on the whole world.</p>
      </SectionCard>

      {/* Closing Prayer */}
      <SectionCard title="Closing Prayer">
        <p>Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.</p>
      </SectionCard>

    </div>
  );
}

/* --- Collapsible Card Component --- */

function SectionCard({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl shadow p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left text-lg font-semibold flex justify-between"
      >
        {title}
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-3 text-sm space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
