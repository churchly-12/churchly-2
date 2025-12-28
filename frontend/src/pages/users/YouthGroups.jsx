import { useState, useEffect } from 'react';

// Image Preview Modal Component
const ImagePreviewModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative max-w-4xl max-h-full p-4">
        <img
          src={image}
          alt="Preview"
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default function YouthGroups() {
  const [previewImage, setPreviewImage] = useState(null);
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState("Youth Meet happens on the first Sunday of every month.");
  const [announcements, setAnnouncements] = useState([
    { text: "Youth choir practice will resume from next week.", image: null },
    { text: "Registrations open for Youth Retreat 2025.", image: null },
    { text: "Bible study session moved to Hall B.", image: null }
  ]);
  const [events, setEvents] = useState([
    { title: "Youth Retreat", date: "Jan 12" },
    { title: "Praise & Worship Practice", date: "Every Friday" },
    { title: "Bible Study", date: "Every Tuesday" },
    { title: "Monthly Youth Meet", date: "First Sunday of every month" }
  ]);
  const [leaders, setLeaders] = useState([
    { name: "Joseph Samuel", role: "Youth Coordinator" },
    { name: "Maria Grace", role: "Choir Lead" }
  ]);
  const [contact, setContact] = useState({
    coordinator: "Joseph Samuel",
    email: "josephsamuel@example.com",
    phone: "+91 98765 12345"
  });

  // Load data from localStorage on component mount and when storage changes
  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('youthGroupsData');
      if (savedData) {
        const data = JSON.parse(savedData);
        setPinnedAnnouncement(data.pinnedAnnouncement || pinnedAnnouncement);
        // Ensure announcements are always in the correct object format
        const loadedAnnouncements = data.announcements || announcements;
        const formattedAnnouncements = loadedAnnouncements.map(ann =>
          typeof ann === 'string' ? { text: ann, image: null } : ann
        );
        setAnnouncements(formattedAnnouncements);
        setEvents(data.events || events);
        setLeaders(data.leaders || leaders);
        setContact(data.contact || contact);
      }
    };

    loadData();

    // Listen for storage changes (when admin updates data)
    const handleStorageChange = (e) => {
      if (e.key === 'youthGroupsData') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(loadData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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
        <p>📌 {pinnedAnnouncement}</p>
      </div>

      {/* Announcement Cards */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <ul className="list-disc list-inside space-y-2">
          {announcements.map((announcement, index) => (
            <li key={index} className="font-bold text-[#4b3426]">
              {announcement.text}
              {announcement.image && (
                <img
                  src={announcement.image}
                  alt="Announcement"
                  className="mt-2 max-w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setPreviewImage(announcement.image)}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Upcoming Events */}
      <h2 className="text-xl font-semibold mb-2 text-[#6b4a2d]">Upcoming Events</h2>

      <div className="space-y-3 mb-6">
        {events.map((event, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow">
            <p className="font-semibold text-[#4b3426]">{event.title}</p>
            <p className="text-[#6b4a2d]/90">Date: {event.date}</p>
          </div>
        ))}
      </div>

      {/* Group Leaders */}
      <h2 className="text-xl font-semibold mb-2 text-[#6b4a2d]">Group Leaders / Mentors</h2>

      <div className="space-y-3 mb-6">
        {leaders.map((leader, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow">
            <p className="font-semibold text-[#4b3426]">{leader.name}</p>
            <p className="text-[#6b4a2d]/90">{leader.role}</p>
          </div>
        ))}
      </div>

      {/* Contact Card */}
      <h2 className="text-xl font-semibold mb-2 text-[#6b4a2d]">Contact Youth Coordinator</h2>

      <div className="bg-white p-4 rounded-xl shadow mb-10">
        <p className="text-[#6b4a2d]/90"><span className="font-semibold text-[#4b3426]">Youth Coordinator:</span> {contact.coordinator}</p>
        <p className="text-[#6b4a2d]/90">Email: {contact.email}</p>
        <p className="text-[#6b4a2d]/90">Phone: {contact.phone}</p>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}