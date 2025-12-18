import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";

export default function StationsPage() {
  const navigate = useNavigate();

  const stations = [
    {
      title: "1. Jesus is Condemned to Death",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider how Jesus, innocent and holy, is condemned to death by Pilate, though He has done no wrong. (Kneel)

All: O my Jesus, I adore You and praise You for Your great love.
I repent of ever having offended You.
Grant that I may never separate myself from You again.
May I love You always, and do with me as You will.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "2. Jesus Takes Up His Cross",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider how Jesus, burdened with the cross, accepts it for our salvation. (Kneel)

All: O my Jesus, I thank You for Your suffering.
May I bear my own crosses with patience and love.
Grant that I may follow You in all trials of life.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "3. Jesus Falls the First Time",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider Jesus falling beneath the weight of the cross, bearing our sins. (Kneel)

All: O my Jesus, I adore You for Your humility and patience.
Help me rise after every fall and walk in Your ways.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "4. Jesus Meets His Mother",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider the sorrow of Mary as she meets her suffering Son. (Kneel)

All: O my Jesus, I offer You my heart.
Teach me to share in Your suffering with love and courage.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "5. Simon of Cyrene Helps Jesus Carry the Cross",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider Simon helping Jesus carry the cross, sharing in His suffering. (Kneel)

All: O my Jesus, help me assist others in their burdens,
and unite my sufferings with Yours.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "6. Veronica Wipes the Face of Jesus",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider Veronica showing compassion by wiping the face of Jesus. (Kneel)

All: O my Jesus, grant that I may always show mercy and love to others,
and console those who suffer.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "7. Jesus Falls the Second Time",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider Jesus falling again, burdened by our sins. (Kneel)

All: O my Jesus, strengthen me to persevere in trials,
and never despair under my burdens.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "8. Jesus Meets the Women of Jerusalem",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider Jesus comforting the women who weep for Him. (Kneel)

All: O my Jesus, grant me compassion for those who grieve,
and help me console them with love.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "9. Jesus Falls the Third Time",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider Jesus’ final fall before reaching Calvary. (Kneel)

All: O my Jesus, help me to rise from my sins,
and walk faithfully with You all my life.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "10. Jesus is Stripped of His Garments",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider Jesus humiliated as He is stripped of His garments. (Kneel)

All: O my Jesus, teach me humility and detachment from worldly pride.
May I be clothed in Your love.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "11. Jesus is Nailed to the Cross",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider Jesus nailed to the cross, suffering for our salvation. (Kneel)

All: O my Jesus, unite my sufferings with Yours,
and grant that I may love You above all things.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "12. Jesus Dies on the Cross",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider Jesus breathing His last for love of us. (Kneel)

All: O my Jesus, I give You my heart and life.
May I always follow You and live in Your love.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "13. Jesus is Taken Down from the Cross",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider the disciples and Mary taking down Jesus’ body with care. (Kneel)

All: O my Jesus, help me show care and respect for the suffering,
and unite my heart with Yours in all things.
(Our Father, Hail Mary, Glory Be)
`
    },
    {
      title: "14. Jesus is Placed in the Sepulcher",
      text: `
Leader: We adore You, O Christ, and we praise You. (Genuflect)
All: Because, by Your holy cross, You have redeemed the world. (Rise)

Leader: Consider how the disciples carried the body of Jesus to its burial,
while His holy Mother arranged it in the sepulcher with her own hands.
They then closed the tomb and departed. (Kneel)

All: Oh, my buried Jesus,
I kiss the stone that closes You in.
But You gloriously did rise again on the third day.
I beg You by Your resurrection that I may be raised gloriously on the last day,
to be united with You in heaven, to praise You and love You forever.
I love You, Jesus, my love, above all things.
I repent with my whole heart for ever having offended You.
Never permit me to separate myself from You again.
Grant that I may love You always and then do with me as You will.
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
            <h1 className="text-xl font-bold text-white tracking-wide">Stations of the Cross</h1>

            {/* Empty space for balance */}
            <div className="w-6"></div>
          </div>
        </div>
      </motion.nav>


      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center">Stations of the Cross</h1>
      <p className="text-center opacity-70 text-sm mt-1">
        Meditate on the Passion of our Lord
      </p>

      {/* Stations List */}
      <div className="mt-6">
        {stations.map((station, index) => (
          <StationCard key={index} title={station.title} text={station.text} />
        ))}
      </div>

    </div>
  );
}

/* --- STATION CARD COMPONENT --- */

function StationCard({ title, text }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl shadow p-4 mt-4">

      {/* Title Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between text-left text-lg font-semibold"
      >
        {title}
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-2 text-sm leading-relaxed whitespace-pre-line"
          >
            <p className="text-sm opacity-90 leading-relaxed">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
