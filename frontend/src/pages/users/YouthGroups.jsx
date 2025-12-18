export default function YouthGroups() {
  return (
    <div className="min-h-screen p-4 bg-[#f7efe6] text-[#3b2a20]">

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4 text-[#3b2a20]">Youth Groups</h1>

      {/* Intro */}
      <p className="text-[#6b4a2d]/90 mb-6">
        A space for young people to grow in faith, fellowship, and service through prayer groups, choir, bible circles, and youth meetups.
      </p>

      {/* Announcements */}
      <h2 className="text-xl font-semibold mb-2 text-[#6b4a2d]">Announcements</h2>

      {/* Pinned Announcement */}
      <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl shadow mb-3 border-l-4 border-yellow-500">
        <p>📌 Youth Meet happens on the <b>first Sunday of every month</b>.</p>
      </div>

      {/* Announcement Cards */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <ul className="list-disc list-inside space-y-2">
          <li className="font-bold text-[#4b3426]">Youth choir practice will resume from next week.</li>
          <li className="font-bold text-[#4b3426]">Registrations open for Youth Retreat 2025.</li>
          <li className="font-bold text-[#4b3426]">Bible study session moved to Hall B.</li>
        </ul>
      </div>

      {/* Upcoming Events */}
      <h2 className="text-xl font-semibold mb-2 text-[#6b4a2d]">Upcoming Events</h2>

      <div className="space-y-3 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="font-semibold text-[#4b3426]">Youth Retreat</p>
          <p className="text-[#6b4a2d]/90">Date: Jan 12</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="font-semibold text-[#4b3426]">Praise & Worship Practice</p>
          <p className="text-[#6b4a2d]/90">Every Friday</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="font-semibold text-[#4b3426]">Bible Study</p>
          <p className="text-[#6b4a2d]/90">Every Tuesday</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="font-semibold text-[#4b3426]">Monthly Youth Meet</p>
          <p className="text-[#6b4a2d]/90">First Sunday of every month</p>
        </div>
      </div>

      {/* Group Leaders */}
      <h2 className="text-xl font-semibold mb-2 text-[#6b4a2d]">Group Leaders / Mentors</h2>

      <div className="space-y-3 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="font-semibold text-[#4b3426]">Joseph Samuel</p>
          <p className="text-[#6b4a2d]/90">Youth Coordinator</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="font-semibold text-[#4b3426]">Maria Grace</p>
          <p className="text-[#6b4a2d]/90">Choir Lead</p>
        </div>
      </div>

      {/* Contact Card */}
      <h2 className="text-xl font-semibold mb-2 text-[#6b4a2d]">Contact Youth Coordinator</h2>

      <div className="bg-white p-4 rounded-xl shadow mb-10">
        <p className="text-[#6b4a2d]/90"><span className="font-semibold text-[#4b3426]">Youth Coordinator:</span> Joseph Samuel</p>
        <p className="text-[#6b4a2d]/90">Email: josephsamuel@example.com</p>
        <p className="text-[#6b4a2d]/90">Phone: +91 98765 12345</p>
      </div>

    </div>
  );
}