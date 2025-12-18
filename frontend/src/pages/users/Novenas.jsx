import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function NovenasPage() {
  const navigate = useNavigate();

  const novenas = [
    {
      title: "Novena to the Sacred Heart of Jesus",
      text: `
Leader: In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.

All: O most holy Heart of Jesus, fountain of every blessing, I adore You, I love You, and with a lively sorrow for my sins, I offer You this poor heart of mine. (Kneel)

Leader: Make me humble, patient, pure, and wholly obedient to Your will. Grant, Good Jesus, that I may live in You and for You. (Rise)

All: Protect me in life and in death. Amen.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "Novena to Our Lady of Perpetual Help",
      text: `
Leader: O Mother of Perpetual Help, we come before You with trust and devotion. (Kneel)

All: Look upon us with mercy and aid us in all our necessities. Comfort the afflicted, guide the sinner, and protect the faithful. (Rise)

Leader: We place all our hope in Your loving care. Help us to grow in holiness each day. (Kneel)

All: Amen.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "Novena to St. Jude Thaddeus",
      text: `
Leader: Glorious Apostle, St. Jude, faithful servant and friend of Jesus, (Kneel)

All: Pray for us, and grant us the grace to persevere in hope. Assist us in our present needs. (Rise)

Leader: May we receive consolation in our trials and guidance in our troubles. (Kneel)

All: Amen.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "Novena to the Holy Spirit",
      text: `
Leader: Come, Holy Spirit, fill the hearts of Your faithful and enkindle in them the fire of Your love. (Kneel)

All: Send forth Your Spirit and they shall be created, and You shall renew the face of the earth. (Rise)

Leader: Grant us the gifts of wisdom, understanding, counsel, fortitude, knowledge, piety, and fear of the Lord. (Kneel)

All: Amen.
(Our Father, Hail Mary, Glory Be)
`
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5e8d8] text-[#3a2c1a] px-4 pt-16 py-6 relative overflow-hidden">

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
            <h1 className="text-xl font-bold text-white tracking-wide">Novenas</h1>

            {/* Empty space for balance */}
            <div className="w-6"></div>
          </div>
        </div>
      </motion.nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center">Novenas</h1>
      <p className="text-center opacity-70 text-sm mt-1">Pray these novenas for intercession and grace</p>

      <div className="mt-6">
        {novenas.map((novena, index) => (
          <NovenaCard key={index} title={novena.title} text={novena.text} />
        ))}
      </div>
    </div>
  );
}

function NovenaCard({ title, text }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl shadow p-4 mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between text-left text-lg font-semibold"
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
            className="overflow-hidden mt-2 text-sm leading-relaxed whitespace-pre-line"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}