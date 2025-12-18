import { Link } from "react-router-dom";
import { Book, Heart, Sunrise, Circle, Cross, ListChecks, Clock, Calendar } from "lucide-react";

export default function Devotions() {
  const items = [
    { title: "Daily Rosary", path: "/users/rosary", icon: <Circle size={28}/> },
    { title: "Divine Mercy Chaplet", path: "/users/divine-mercy", icon: <Heart size={28}/> },
    { title: "Stations of the Cross", path: "/users/stations", icon: <Cross size={28}/> },
    { title: "Novenas", path: "/users/novenas", icon: <Book size={28}/> },
    { title: "Daily Readings", path: "/users/readings", icon: <Sunrise size={28}/> },
    { title: "Fasting & Abstinence Guide", path: "/users/fasting-guide", icon: <Clock size={28}/> },
    { title: "Liturgy Calendar", path: "/users/liturgy-calendar", icon: <Calendar size={28} /> },
    { title: "Short Prayers", path: "/users/prayers", icon: <ListChecks size={28}/> },
  ];

  return (
    <div className="min-h-screen px-6 py-8 bg-[#f7efe6] text-[#3b2a20]">
      <header className="max-w-3xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold">Devotions</h1>
        <p className="mt-1 text-sm text-[#6b4a2d]/90">
          Explore prayers, readings, and spiritual practices.
        </p>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="bg-gray-100 dark:bg-[#181818]
              p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center
              hover:scale-105 transition-transform"
          >
            <div className="mb-2">{item.icon}</div>
            <p className="text-sm font-medium text-center">{item.title}</p>
          </Link>
        ))}
        </div>
      </main>
    </div>
  );
}