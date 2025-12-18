import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, X } from "lucide-react";

export default function RosaryPageEnhanced() {
  const [selectedMystery, setSelectedMystery] = useState("auto");
  const [isPlaying, setIsPlaying] = useState(false);
  const [litanyOpen, setLitanyOpen] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const AUDIO_SRC = ""; // Placeholder for audio source

  // Detect mystery of the day
  const getMysteryOfDay = () => {
    const d = new Date().getDay();
    switch (d) {
      case 0: return "Glorious Mysteries";   // Sunday
      case 1: return "Joyful Mysteries";     // Monday
      case 2: return "Sorrowful Mysteries";  // Tuesday
      case 3: return "Glorious Mysteries";   // Wednesday
      case 4: return "Luminous Mysteries";   // Thursday
      case 5: return "Sorrowful Mysteries";  // Friday
      case 6: return "Joyful Mysteries";     // Saturday
      default: return "Joyful Mysteries";
    }
  };

  // Audio controls
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {
        // handle autoplay block in some browsers
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };


  // MYSTERY DATA WITH SCRIPTURE SUMMARIES
  const mysteryData = {
    "Joyful Mysteries": [
      {
        title: "1. The Annunciation",
        scripture: "Luke 1:26–38 — *The angel Gabriel announces to Mary that she will conceive the Son of God...*",
      },
      {
        title: "2. The Visitation",
        scripture: "Luke 1:39–56 — *Mary visits Elizabeth; the child leaps in her womb...*",
      },
      {
        title: "3. The Nativity",
        scripture: "Luke 2:1–20 — *Jesus is born in Bethlehem; angels announce to shepherds...*",
      },
      {
        title: "4. The Presentation",
        scripture: "Luke 2:22–40 — *Jesus is presented in the Temple; Simeon and Anna prophesy...*",
      },
      {
        title: "5. The Finding in the Temple",
        scripture: "Luke 2:41–52 — *Jesus is found among the teachers in the Temple...*",
      },
    ],

    "Sorrowful Mysteries": [
      {
        title: "1. The Agony in the Garden",
        scripture: "Luke 22:39–46 — *Jesus prays in agony; angels minister to Him...*",
      },
      {
        title: "2. The Scourging at the Pillar",
        scripture: "John 19:1 — *Jesus is scourged by Pilate's soldiers...*",
      },
      {
        title: "3. The Crowning with Thorns",
        scripture: "Matthew 27:27–31 — *Soldiers mock Jesus as King of the Jews...*",
      },
      {
        title: "4. Carrying of the Cross",
        scripture: "John 19:16–17 — *Jesus carries His cross to Golgotha...*",
      },
      {
        title: "5. The Crucifixion",
        scripture: "Luke 23:33–49 — *Jesus is crucified between two thieves...*",
      },
    ],

    "Glorious Mysteries": [
      {
        title: "1. The Resurrection",
        scripture: "Matthew 28:1–10 — *Jesus rises from the dead; angels announce to the women...*",
      },
      {
        title: "2. The Ascension",
        scripture: "Acts 1:6–11 — *Jesus ascends into heaven before His disciples...*",
      },
      {
        title: "3. The Descent of the Holy Spirit",
        scripture: "Acts 2:1–13 — *The Holy Spirit descends upon the Apostles...*",
      },
      {
        title: "4. The Assumption of Mary",
        scripture: "Traditional Teaching — *Mary is taken body and soul into heavenly glory...*",
      },
      {
        title: "5. The Coronation of Mary",
        scripture: "Revelation 12:1 — *Mary is crowned Queen of Heaven...*",
      },
    ],

    "Luminous Mysteries": [
      {
        title: "1. The Baptism of the Lord",
        scripture: "Matthew 3:13–17 — *Jesus is baptized in the Jordan; the Spirit descends...*",
      },
      {
        title: "2. The Wedding at Cana",
        scripture: "John 2:1–12 — *Jesus performs His first miracle at Cana...*",
      },
      {
        title: "3. Proclamation of the Kingdom",
        scripture: "Mark 1:14–15 — *Jesus begins His public ministry...*",
      },
      {
        title: "4. The Transfiguration",
        scripture: "Matthew 17:1–9 — *Jesus is transfigured before Peter, James, and John...*",
      },
      {
        title: "5. The Institution of the Eucharist",
        scripture: "Luke 22:14–20 — *Jesus institutes the Holy Eucharist...*",
      },
    ],
  };

  // Determine which mystery to display
  const displayMystery = selectedMystery === "auto" ? getMysteryOfDay() : selectedMystery;
  const currentMysteries = mysteryData[displayMystery] || [];

  // Litany text (complete, traditional style trimmed for space but include full invocations)
  const litanyLines = [
    "Lord, have mercy on us.",
    "Christ, have mercy on us.",
    "Lord, have mercy on us.",
    "Christ, hear us.",
    "Christ, graciously hear us.",
    "God the Father of Heaven, have mercy on us.",
    "God the Son, Redeemer of the world, have mercy on us.",
    "God the Holy Spirit, have mercy on us.",
    "Holy Trinity, One God, have mercy on us.",
    "Holy Mary, pray for us.",
    "Holy Mother of God, pray for us.",
    "Holy Virgin of virgins, pray for us.",
    "Mother of Christ, pray for us.",
    "Mother of divine grace, pray for us.",
    "Mother most pure, pray for us.",
    "Mother most chaste, pray for us.",
    "Mother inviolate, pray for us.",
    "Mother undefiled, pray for us.",
    "Mother most amiable, pray for us.",
    "Mother most admirable, pray for us.",
    "Mother of good counsel, pray for us.",
    "Mother of our Creator, pray for us.",
    "Mother of our Savior, pray for us.",
    "Virgin most prudent, pray for us.",
    "Virgin most venerable, pray for us.",
    "Virgin most renowned, pray for us.",
    "Virgin most powerful, pray for us.",
    "Virgin most merciful, pray for us.",
    "Virgin most faithful, pray for us.",
    "Mirror of justice, pray for us.",
    "Seat of wisdom, pray for us.",
    "Cause of our joy, pray for us.",
    "Spiritual vessel, pray for us.",
    "Vessel of honor, pray for us.",
    "Singular vessel of devotion, pray for us.",
    "Mystical rose, pray for us.",
    "Tower of David, pray for us.",
    "Tower of ivory, pray for us.",
    "House of gold, pray for us.",
    "Ark of the covenant, pray for us.",
    "Gate of Heaven, pray for us.",
    "Morning star, pray for us.",
    "Health of the sick, pray for us.",
    "Refuge of sinners, pray for us.",
    "Comforter of the afflicted, pray for us.",
    "Help of Christians, pray for us.",
    "Queen of Angels, pray for us.",
    "Queen of Patriarchs, pray for us.",
    "Queen of Prophets, pray for us.",
    "Queen of Apostles, pray for us.",
    "Queen of Martyrs, pray for us.",
    "Queen of Confessors, pray for us.",
    "Queen of Virgins, pray for us.",
    "Queen of all Saints, pray for us.",
    "Queen conceived without original sin, pray for us.",
    "Queen assumed into Heaven, pray for us.",
    "Queen of the most holy Rosary, pray for us.",
    "Queen of Peace, pray for us.",
    "Lamb of God, who takes away the sins of the world, spare us, O Lord.",
    "Lamb of God, who takes away the sins of the world, graciously hear us, O Lord.",
    "Lamb of God, who takes away the sins of the world, have mercy on us.",
    "V. Pray for us, O holy Mother of God.",
    "R. That we may be made worthy of the promises of Christ.",
    "Let us pray. O God, whose only begotten Son, by His life, death, and resurrection, has purchased for us the rewards of eternal life, grant, we beseech Thee, that meditating upon these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen."
  ];

  // Small helper for brown/cream theme classes
  const theme = {
    bg: "bg-cream-50 dark:bg-[#1b1108]", // fallback names; add your Tailwind config or adjust if needed
    card: "bg-[rgba(255,249,240,0.9)] dark:bg-[#2b1f18]/60",
    border: "border-[#6b4a2d]/30",
    accent: "text-[#6b4a2d]",
    gold: "shadow-[0_8px_30px_rgba(107,74,45,0.12)]"
  };

  /* If you do not have a 'cream' color in tailwind, change bg-cream-50 to bg-[#f7efe6] */
  // Safe fallback inline style approach:
  const pageBg = { background: "linear-gradient(180deg,#f7efe6 0%, #f1e8dd 100%)" };

  return (
    <div
      className="min-h-screen py-8 px-4 md:px-10 text-[#3b2a20] relative overflow-hidden"
      style={pageBg}
    >

      {/* Custom Top Bar for Rosary Page */}
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
            <h1 className="text-xl font-bold text-white tracking-wide">Holy Rosary</h1>

            {/* Empty space for balance */}
            <div className="w-6"></div>
          </div>
        </div>
      </motion.nav>


      {/* Page header */}
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-[#5b3a24] text-center mb-6 tracking-tight"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Holy Rosary
      </motion.h1>

      <div className="max-w-3xl mx-auto">
        {/* Top card: Mystery selector + small preview (kept minimal per request) */}
        <motion.div
          className={`rounded-2xl p-5 ${theme.card} border ${theme.border} ${theme.gold}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#6b4a2d]">Mystery Mode</p>
              <p className="mt-1 text-sm text-[#5b3a24]/80">
                Auto–detect today's mystery or view all mysteries manually.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedMystery}
                onChange={(e) => setSelectedMystery(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/90 border border-[#e9dfd2] text-sm shadow-sm"
                defaultValue="auto"
                aria-label="Mystery selection"
              >
                <option value="auto">Auto Detect</option>
                <option value="Joyful Mysteries">Joyful Mysteries</option>
                <option value="Sorrowful Mysteries">Sorrowful Mysteries</option>
                <option value="Glorious Mysteries">Glorious Mysteries</option>
                <option value="Luminous Mysteries">Luminous Mysteries</option>
              </select>

            </div>
          </div>
        </motion.div>

        {/* MAIN CONTENT: Mystery Cards */}
        <div className="mt-6 space-y-4">
          {currentMysteries.map((mystery, index) => (
            <motion.div
              key={index}
              className={`rounded-xl p-4 ${theme.card} border ${theme.border} shadow-sm`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <h3 className="font-semibold text-[#5b3a24]">{mystery.title}</h3>
              <p className="mt-1 text-sm text-[#3b2a20]/85">
                {mystery.scripture}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Litany Card */}
        <motion.div
          className={`mt-8 rounded-2xl p-4 ${theme.card} border ${theme.border} ${theme.gold}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-3">
              {/* Swinging cross */}
              <motion.div
                className="w-10 h-10 rounded-md bg-[rgba(107,74,45,0.08)] flex items-center justify-center"
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
                aria-hidden
              >
                {/* simple cross svg */}
                <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7.5" y="1" width="3" height="20" rx="1.5" fill="#6b4a2d"/>
                  <rect x="1" y="9" width="16" height="3" rx="1.5" fill="#6b4a2d"/>
                </svg>
              </motion.div>

              <div>
                <h4 className="text-lg font-semibold text-[#5b3a24]">Litany of the Blessed Virgin Mary</h4>
                <p className="text-sm text-[#5b3a24]/80 mt-1">Tap the button to expand the litany.</p>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setLitanyOpen(!litanyOpen)}
                className="px-3 py-2 rounded-lg bg-[#6b4a2d] text-white flex items-center gap-2"
                aria-expanded={litanyOpen}
                aria-controls="litany-content"
              >
                <span>{litanyOpen ? "Close" : "Expand"}</span>
                <motion.span animate={{ rotate: litanyOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={16} />
                </motion.span>
              </button>
            </div>
          </div>

          {/* Animated expand area with glow on open */}
          <AnimatePresence initial={false}>
            {litanyOpen && (
              <motion.div
                id="litany-content"
                key="litany"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 260, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="mt-4 overflow-hidden rounded-md"
                style={{ boxShadow: "0 10px 40px rgba(107,74,45,0.12)" }}
              >
                <motion.div
                  className="h-full overflow-y-auto pr-3 pb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 }}
                >
                  <div className="space-y-2 text-sm leading-relaxed px-2">
                    {litanyLines.map((line, idx) => (
                      <p key={idx} className="text-[#3b2a20]/90">
                        {line}
                      </p>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>


      {/* Hidden audio element */}
      <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />

    </div>
  );
}
