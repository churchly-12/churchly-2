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

export default function AdminActivities() {

  const items = [
    {
      title: "Youth Groups",
      desc: "Prayer groups, choir, bible circles, youth meetups.",
      Icon: Users
    },
    {
      title: "Community Groups",
      desc: "Women's groups, men's groups, family cells, outreach teams.",
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
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Activities</h1>
        <p className="mt-1 text-sm text-slate-600">
          Get involved — find groups, events and sacramental services.
        </p>
      </header>

      <main className="grid gap-4">
        {items.map((item) => {
          if (item.title === "Youth Groups") {
            return (
              <Link
                key={item.title}
                to="/admin/youth-groups"
                className="flex items-center gap-4 w-full text-left rounded-lg p-4
                           bg-white shadow-sm border border-slate-200
                           hover:shadow-md transition-shadow"
                aria-label={item.title}
              >
                <div
                  className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center bg-slate-100"
                >
                  <item.Icon size={20} className="text-slate-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {item.title}
                    </h2>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                </div>
              </Link>
            );
          } else {
            return (
              <button
                key={item.title}
                type="button"
                className="flex items-center gap-4 w-full text-left rounded-lg p-4
                           bg-white shadow-sm border border-slate-200
                           hover:shadow-md transition-shadow"
                aria-label={item.title}
                onClick={() => {
                  /* Navigate to detail or open later — placeholder */
                  console.log("open", item.title);
                }}
              >
                <div
                  className="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center bg-slate-100"
                >
                  <item.Icon size={20} className="text-slate-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {item.title}
                    </h2>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                </div>
              </button>
            );
          }
        })}

      </main>
    </div>
  );
}