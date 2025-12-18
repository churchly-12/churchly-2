import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function FastingGuidePage() {
  const navigate = useNavigate();

  const guides = [
    {
      title: "Fasting Rules",
      text: `
Leader: On Ash Wednesday and Good Friday, Catholics aged 18-59 are called to fast. (Kneel)

All: Fasting means taking only one full meal and two smaller meals that together do not equal a full meal.
No eating between meals. (Rise)
`
    },
    {
      title: "Abstinence Rules",
      text: `
Leader: All Fridays of Lent, and Ash Wednesday, all Catholics aged 14 and older should abstain from meat. (Kneel)

All: Abstinence means refraining from eating meat, but eggs, milk products, and fish are allowed. (Rise)
`
    },
    {
      title: "Exceptions",
      text: `
Leader: The sick, pregnant or nursing women, and young children are exempt from fasting and abstinence. (Kneel)

All: Individuals should substitute with acts of charity or prayer if unable to fast or abstain. (Rise)
`
    },
    {
      title: "Purpose",
      text: `
Leader: Fasting and abstinence help us grow in self-discipline, charity, and spiritual focus. (Kneel)

All: Through these practices, we unite our sacrifices with Christ’s Passion and prepare our hearts for Easter. (Rise)
`
    }
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
            <h1 className="text-xl font-bold text-white tracking-wide">Fasting & Abstinence Guide</h1>

            {/* Empty space for balance */}
            <div className="w-6"></div>
          </div>
        </div>
      </motion.nav>

      <h1 className="text-2xl font-bold text-center">Fasting and Abstinence Guide</h1>
      <p className="text-center opacity-70 text-sm mt-1">Practical guide for Catholic fasting and abstinence</p>

      <div className="mt-6 space-y-4">
        {guides.map((guide, index) => (
          <GuideCard key={index} title={guide.title} text={guide.text} />
        ))}
      </div>
    </div>
  );
}

function GuideCard({ title, text }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative bg-[#fdf5e6] border-l-8 border-[#c6ad92] rounded-xl shadow-lg p-5 transition-all duration-300 hover:shadow-xl hover:ring-1 hover:ring-[#c6ad92]">
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