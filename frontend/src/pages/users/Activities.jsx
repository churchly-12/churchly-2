import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Users2,
  Activity,
  MapPin,
  Calendar,
  Wrench,
  Megaphone,
  BookOpen,
  ChevronRight
} from "lucide-react";

export default function ActivitiesPage() {

  const items = [
    {
      title: "Youth Groups",
      desc: "Prayer groups, choir, bible circles, youth meetups.",
      Icon: Users
    },
    {
      title: "Community Groups",
      desc: "Women’s groups, men’s groups, family cells, outreach teams.",
      Icon: Users2
    },
    {
      title: "Sports & Events",
      desc: "Tournaments, indoor & outdoor games, parish fun events.",
      Icon: Activity
    },
    {
      title: "Retreats / Camps / Pilgrimages",
      desc: "Church retreats, youth camps, one-day and long pilgrimages.",
      Icon: MapPin
    },
    {
      title: "Workshops",
      desc: "Skill development, bible formation, choir training, liturgy.",
      Icon: Wrench
    },
    {
      title: "Weekly Announcements",
      desc: "Mass schedules, notices, community updates.",
      Icon: Megaphone
    },
    {
      title: "Sacramental Services",
      desc: "Baptism, Marriage Banns, First Communion, Confirmation, RCIA.",
      Icon: BookOpen
    }
  ];

  return (
    <div className="min-h-screen px-6 py-8 bg-[#f7efe6] text-[#3b2a20]">
      <header className="max-w-3xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold">Activities</h1>
        <p className="mt-1 text-sm text-[#6b4a2d]/90">
          Get involved — find groups, events and sacramental services.
        </p>
      </header>

      <main className="max-w-3xl mx-auto grid gap-4">
        {items.map((item) => {
          if (item.title === "Youth Groups") {
            return (
              <Link
                key={item.title}
                to="/users/youth-groups"
                className="flex items-center gap-4 w-full text-left rounded-2xl p-4
                           bg-white shadow-sm border border-[#e8dccf]
                           hover:translate-y-[-2px] transition-transform"
                aria-label={item.title}
              >
                <div
                  className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(107,74,45,0.08), rgba(107,74,45,0.04))",
                    border: "2px solid rgba(107,74,45,0.10)"
                  }}
                >
                  <item.Icon size={20} className="text-[#6b4a2d]" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#4b3426]">
                      {item.title}
                    </h2>
                    <ChevronRight size={16} className="text-[#8a6b50]" />
                  </div>
                  <p className="mt-1 text-sm text-[#6b4a2d]/90">{item.desc}</p>
                </div>
              </Link>
            );
          } else {
            return (
              <button
                key={item.title}
                type="button"
                className="flex items-center gap-4 w-full text-left rounded-2xl p-4
                           bg-white shadow-sm border border-[#e8dccf]
                           hover:translate-y-[-2px] transition-transform"
                aria-label={item.title}
                onClick={() => {
                  /* Navigate to detail or open later — placeholder */
                }}
              >
                <div
                  className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(107,74,45,0.08), rgba(107,74,45,0.04))",
                    border: "2px solid rgba(107,74,45,0.10)"
                  }}
                >
                  <item.Icon size={20} className="text-[#6b4a2d]" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#4b3426]">
                      {item.title}
                    </h2>
                    <ChevronRight size={16} className="text-[#8a6b50]" />
                  </div>
                  <p className="mt-1 text-sm text-[#6b4a2d]/90">{item.desc}</p>
                </div>
              </button>
            );
          }
        })}

      </main>
    </div>
  );
}