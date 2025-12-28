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

export default function AdminYouthGroups() {
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState("Youth Meet happens on the first Sunday of every month.");
  const [isEditingPinned, setIsEditingPinned] = useState(false);

  const [announcements, setAnnouncements] = useState([
    { text: "Youth choir practice will resume from next week.", image: null },
    { text: "Registrations open for Youth Retreat 2025.", image: null },
    { text: "Bible study session moved to Hall B.", image: null }
  ]);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({ text: "", image: null });

  const [events, setEvents] = useState([
    { title: "Youth Retreat", date: "Jan 12" },
    { title: "Praise & Worship Practice", date: "Every Friday" },
    { title: "Bible Study", date: "Every Tuesday" },
    { title: "Monthly Youth Meet", date: "First Sunday of every month" }
  ]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });

  const [leaders, setLeaders] = useState([
    { name: "Joseph Samuel", role: "Youth Coordinator" },
    { name: "Maria Grace", role: "Choir Lead" }
  ]);
  const [editingLeader, setEditingLeader] = useState(null);
  const [newLeader, setNewLeader] = useState({ name: "", role: "" });

  const [contact, setContact] = useState({
    coordinator: "Joseph Samuel",
    email: "josephsamuel@example.com",
    phone: "+91 98765 12345"
  });
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('youthGroupsData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPinnedAnnouncement(data.pinnedAnnouncement || pinnedAnnouncement);
      setAnnouncements(data.announcements || announcements);
      setEvents(data.events || events);
      setLeaders(data.leaders || leaders);
      setContact(data.contact || contact);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const data = {
      pinnedAnnouncement,
      announcements,
      events,
      leaders,
      contact
    };
    try {
      localStorage.setItem('youthGroupsData', JSON.stringify(data));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Image data may not persist.');
        // Try to save without images
        const dataWithoutImages = {
          ...data,
          announcements: data.announcements.map(ann => ({ ...ann, image: null }))
        };
        try {
          localStorage.setItem('youthGroupsData', JSON.stringify(dataWithoutImages));
        } catch (e) {
          console.error('Unable to save data to localStorage');
        }
      }
    }
  }, [pinnedAnnouncement, announcements, events, leaders, contact]);

  return (
    <div className="space-y-6">

      {/* Title */}
      <h1 className="text-2xl font-bold text-slate-900">Youth Groups Management</h1>

      {/* Intro */}
      <p className="text-slate-600">
        Manage youth groups, announcements, events, and coordinators for the parish youth ministry.
      </p>

      {/* Announcements */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Announcements</h2>

        {/* Pinned Announcement */}
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {isEditingPinned ? (
                <input
                  type="text"
                  value={pinnedAnnouncement}
                  onChange={(e) => setPinnedAnnouncement(e.target.value)}
                  className="w-full p-2 border border-yellow-300 rounded"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingPinned(false);
                    }
                  }}
                />
              ) : (
                <p>📌 {pinnedAnnouncement}</p>
              )}
            </div>
            <button
              onClick={() => setIsEditingPinned(!isEditingPinned)}
              className="ml-2 text-yellow-700 hover:text-yellow-900"
            >
              {isEditingPinned ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Announcement Cards */}
        <div className="space-y-2">
          {announcements.map((announcement, index) => (
            <div key={index} className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingAnnouncement === index ? (
                    <input
                      type="text"
                      value={announcement.text}
                      onChange={(e) => {
                        const newAnnouncements = [...announcements];
                        newAnnouncements[index].text = e.target.value;
                        setAnnouncements(newAnnouncements);
                      }}
                      className="w-full p-1 border border-slate-300 rounded mb-2"
                      placeholder="Announcement text"
                    />
                  ) : (
                    <span className="font-medium text-slate-900">{announcement.text}</span>
                  )}
                  {announcement.image && (
                    <img
                      src={announcement.image}
                      alt="Announcement"
                      className="mt-2 max-w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setPreviewImage(announcement.image)}
                    />
                  )}
                  {editingAnnouncement === index && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              // Compress the image
                              const img = new Image();
                              img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
  
                                // Reduce size to max 300px width, maintain aspect ratio
                                const maxWidth = 300;
                                const ratio = maxWidth / img.width;
                                canvas.width = maxWidth;
                                canvas.height = img.height * ratio;
  
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5); // 50% quality
  
                                const newAnnouncements = [...announcements];
                                newAnnouncements[index].image = compressedDataUrl;
                                setAnnouncements(newAnnouncements);
                              };
                              img.src = e.target.result;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full p-1 border border-slate-300 rounded"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setEditingAnnouncement(editingAnnouncement === index ? null : index)}
                    className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm"
                  >
                    {editingAnnouncement === index ? 'Save Text' : 'Edit Text'}
                  </button>
                  <button
                    onClick={() => setAnnouncements(announcements.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {newAnnouncement.text || newAnnouncement.image ? (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={newAnnouncement.text}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, text: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded"
              placeholder="New announcement..."
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image (optional):</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      // Compress the image
                      const img = new Image();
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        // Reduce size to max 300px width, maintain aspect ratio
                        const maxWidth = 300;
                        const ratio = maxWidth / img.width;
                        canvas.width = maxWidth;
                        canvas.height = img.height * ratio;

                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5); // 50% quality

                        setNewAnnouncement({ ...newAnnouncement, image: compressedDataUrl });
                      };
                      img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full p-1 border border-slate-300 rounded"
              />
              {newAnnouncement.image && (
                <img src={newAnnouncement.image} alt="New announcement" className="mt-2 max-w-full h-32 object-cover rounded" />
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setAnnouncements([...announcements, newAnnouncement]);
                  setNewAnnouncement({ text: "", image: null });
                }}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setNewAnnouncement({ text: "", image: null })}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setNewAnnouncement({ text: "", image: null })}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Announcement
          </button>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Upcoming Events</h2>

        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              {editingEvent === index ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => {
                      const newEvents = [...events];
                      newEvents[index].title = e.target.value;
                      setEvents(newEvents);
                    }}
                    className="w-full p-1 border border-slate-300 rounded"
                    placeholder="Event title"
                  />
                  <input
                    type="text"
                    value={event.date}
                    onChange={(e) => {
                      const newEvents = [...events];
                      newEvents[index].date = e.target.value;
                      setEvents(newEvents);
                    }}
                    className="w-full p-1 border border-slate-300 rounded"
                    placeholder="Date"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="text-slate-600">Date: {event.date}</p>
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingEvent(editingEvent === index ? null : index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {editingEvent === index ? 'Save' : 'Edit'}
                </button>
                <button
                  onClick={() => setEvents(events.filter((_, i) => i !== index))}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {newEvent.title || newEvent.date ? (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded"
              placeholder="Event title..."
            />
            <input
              type="text"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded"
              placeholder="Date..."
            />
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEvents([...events, newEvent]);
                  setNewEvent({ title: "", date: "" });
                }}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setNewEvent({ title: "", date: "" })}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setNewEvent({ title: "", date: "" })}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Event
          </button>
        )}
      </div>

      {/* Group Leaders */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Group Leaders / Mentors</h2>

        <div className="space-y-3">
          {leaders.map((leader, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              {editingLeader === index ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={leader.name}
                    onChange={(e) => {
                      const newLeaders = [...leaders];
                      newLeaders[index].name = e.target.value;
                      setLeaders(newLeaders);
                    }}
                    className="w-full p-1 border border-slate-300 rounded"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={leader.role}
                    onChange={(e) => {
                      const newLeaders = [...leaders];
                      newLeaders[index].role = e.target.value;
                      setLeaders(newLeaders);
                    }}
                    className="w-full p-1 border border-slate-300 rounded"
                    placeholder="Role"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{leader.name}</p>
                  <p className="text-slate-600">{leader.role}</p>
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingLeader(editingLeader === index ? null : index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {editingLeader === index ? 'Save' : 'Edit'}
                </button>
                <button
                  onClick={() => setLeaders(leaders.filter((_, i) => i !== index))}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {newLeader.name || newLeader.role ? (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              value={newLeader.name}
              onChange={(e) => setNewLeader({ ...newLeader, name: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded"
              placeholder="Name..."
            />
            <input
              type="text"
              value={newLeader.role}
              onChange={(e) => setNewLeader({ ...newLeader, role: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded"
              placeholder="Role..."
            />
            <div className="space-x-2">
              <button
                onClick={() => {
                  setLeaders([...leaders, newLeader]);
                  setNewLeader({ name: "", role: "" });
                }}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setNewLeader({ name: "", role: "" })}
                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setNewLeader({ name: "", role: "" })}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Leader
          </button>
        )}
      </div>

      {/* Contact Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900">Contact Information</h2>

        <div className="space-y-2">
          {isEditingContact ? (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Youth Coordinator:</label>
                <input
                  type="text"
                  value={contact.coordinator}
                  onChange={(e) => setContact({ ...contact, coordinator: e.target.value })}
                  className="w-full p-1 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email:</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full p-1 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone:</label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className="w-full p-1 border border-slate-300 rounded"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-600"><span className="font-semibold text-slate-900">Youth Coordinator:</span> {contact.coordinator}</p>
              <p className="text-slate-600">Email: {contact.email}</p>
              <p className="text-slate-600">Phone: {contact.phone}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsEditingContact(!isEditingContact)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {isEditingContact ? 'Save Contact' : 'Edit Contact'}
        </button>
      </div>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}