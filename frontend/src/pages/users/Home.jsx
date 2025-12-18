import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HandHeart, Star } from "lucide-react";
import DailyVerseCard from "../../components/DailyVerseCard";

export default function Home() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen px-4 py-4
      bg-[#f7efe6]
      text-[#3b2a20]
    ">
      {/* Shrine Banner - Flip Card */}
      <div className="mt-6 mb-6">
        <div
          className={`flip-card cursor-pointer ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="flip-card-inner">
            {/* Front Side */}
            <div className="flip-card-front bg-gradient-to-r from-blue-50 to-purple-50 dark:from-[#181818] dark:to-[#1a1a1a]
                          border border-gray-200 dark:border-[#333333] rounded-xl p-6
                          shadow-md hover:shadow-lg transition-shadow duration-300
                          flex items-center justify-center min-h-full">
              <div className="text-center w-full">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3
                              bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400
                              bg-clip-text text-transparent">
                  Shrine of Our Lady of Health
                </h1>
                <blockquote className="text-base italic text-gray-600 dark:text-[#B3B3B3] max-w-xl mx-auto">
                  "My soul proclaims the greatness of the Lord, and my spirit rejoices in God my Savior."
                </blockquote>
                <cite className="text-sm text-gray-500 dark:text-[#B3B3B3] mt-1">
                  — Mary (Luke 1:46-47)
                </cite>
                <div className="mt-4 flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Tap to see location & image
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div className="flip-card-back bg-gradient-to-r from-purple-50 to-pink-50 dark:from-[#1a1a1a] dark:to-[#181818]
                          border border-gray-200 dark:border-[#333333] rounded-xl p-6
                          shadow-md">
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden border-2 border-white/20">
                    <img
                      src="/church.png"
                      alt="Church"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center text-4xl hidden">
                      ⛪
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Our Lady of Health Shrine
                  </h2>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-lg">📍</span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Hyderabad, Telangana, India
                    </p>
                  </div>

                  <button
                    onClick={() => window.open('https://www.google.com/maps?sca_esv=39fb4ce6952c9081&biw=1536&bih=643&gs_lp=Egxnd3Mtd2l6LXNlcnAiJ291ciBsYWR5IG9mIGdvb2QgaGVhbHRoIGtoYWlyYXRhYmFkIGxvYyoCCAAyBRAhGKABMgUQIRigATIFECEYoAFI3khQ9gxY_kBwBngBkAEAmAGWAqABmgmqAQUwLjQuMrgBAcgBAPgBAZgCDKAC9AnCAgoQABiwAxjWBBhHwgIOEC4YgAQYxwEYjgUYrwHCAgYQABgWGB7CAgIQJsICCxAAGIAEGIYDGIoFwgIIEAAYgAQYogTCAh0QLhiABBjHARiOBRivARiXBRjcBBjeBBjgBNgBAcICBBAhGBWYAwCIBgGQBgi6BgYIARABGBSSBwU2LjQuMqAH9iOyBwUwLjQuMrgHyAnCBwcwLjIuNy4zyAc7&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=Kb9lqBNBl8s7MegFMDAK9ON2&daddr=CF44%2BQCR,+Rock+Memorial+School+St,+Veer+Nagar,+Chintal,+Hyderabad,+Telangana+500004', '_blank')}
                    className="button-38"
                  >
                    <span className="mr-2">🗺️</span>
                    View on Maps
                  </button>
                </div>

                <div className="absolute top-4 right-4 text-xs text-gray-400 dark:text-gray-500 bg-white/80 dark:bg-black/50 px-2 py-1 rounded">
                  Tap to flip back
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Verse Card */}
      <DailyVerseCard />

      {/* Two-card grid: Prayer + Testimonials */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-4">

        {/* Prayer Requests */}
        <Link
          to="/users/prayer-wall"
          className="p-6 bg-white rounded-xl shadow-md
                   border border-gray-200 flex flex-col items-center"
        >
          <HandHeart size={32} className="text-red-500 mb-2" />
          <h3 className="font-semibold text-gray-800 text-sm text-center">
            Prayer Requests
          </h3>
          <p className="text-xs text-gray-500 text-center mt-1">
            Share a need
          </p>
        </Link>

        {/* Testimonials */}
        <Link
          to="/users/testimonials"
          className="p-6 bg-white rounded-xl shadow-md
                   border border-gray-200 flex flex-col items-center"
        >
          <Star size={32} className="text-yellow-500 mb-2" />
          <h3 className="font-semibold text-gray-800 text-sm text-center">
            Testimonials
          </h3>
          <p className="text-xs text-gray-500 text-center mt-1">
            Praise reports
          </p>
        </Link>

      </div>


      {/* Events Card - Animated */}
      <div className="mx-4 mt-4">
        <Link
          to="/users/activities"
          className="group relative flex items-center p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
        >
          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-all duration-500"></div>

          {/* Animated background pulse */}
          <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

          {/* Floating geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-3 right-4 w-3 h-3 border-2 border-blue-300 dark:border-blue-600 rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:rotate-90"></div>
            <div className="absolute bottom-4 left-6 w-2 h-2 bg-blue-200 dark:bg-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-6 left-8 w-1 h-4 bg-gradient-to-b from-blue-300 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-600" style={{ animationDelay: '0.4s' }}></div>
          </div>

          <div className="relative z-10 mr-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-full flex items-center justify-center border border-blue-300 dark:border-blue-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <span className="text-3xl group-hover:animate-bounce">📅</span>
            </div>
          </div>

          <div className="relative z-10 flex-1">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              Church Events
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
              Upcoming services and activities
            </p>
          </div>

        </Link>
      </div>
    </div>
  );
}
