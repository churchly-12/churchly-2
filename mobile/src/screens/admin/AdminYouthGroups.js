import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Modal, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../api/apiClient';
import AdminTopBar from '../../components/AdminTopBar';

const ImagePreviewModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <Modal visible={true} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image source={{ uri: image }} style={styles.fullImage} resizeMode="contain" />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function AdminYouthGroups() {
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState("Youth Meet happens on the first Sunday of every month.");
  const [isEditingPinned, setIsEditingPinned] = useState(false);

  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({ text: "", image: null });
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);

  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", date: "" });
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const [leaders, setLeaders] = useState([
    { name: "Joseph Samuel", role: "Youth Coordinator" },
    { name: "Maria Grace", role: "Choir Lead" }
  ]);
  const [editingLeader, setEditingLeader] = useState(null);
  const [newLeader, setNewLeader] = useState({ name: "", role: "" });
  const [isAddingLeader, setIsAddingLeader] = useState(false);

  const [contact, setContact] = useState({
    coordinator: "Joseph Samuel",
    email: "josephsamuel@example.com",
    phone: "+91 98765 12345"
  });
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch data from API on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [announcementsRes, eventsRes] = await Promise.all([
        apiClient.get('/announcements'),
        apiClient.get('/events')
      ]);
      setAnnouncements(announcementsRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (setImage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <AdminTopBar />
      <ScrollView style={styles.scrollContainer}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#3b2a20" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.title}>Youth Groups Management</Text>
            <Text style={styles.intro}>Manage youth groups, announcements, events, and coordinators for the parish youth ministry.</Text>

      {/* Announcements */}
     <View style={styles.section}>
       <Text style={styles.sectionTitle}>Announcements</Text>

       {/* Pinned Announcement */}
        <View style={styles.pinnedContainer}>
          <View style={styles.pinnedContent}>
            {isEditingPinned ? (
              <TextInput
                value={pinnedAnnouncement}
                onChangeText={setPinnedAnnouncement}
                style={styles.input}
                onSubmitEditing={() => setIsEditingPinned(false)}
              />
            ) : (
              <Text>📌 {pinnedAnnouncement}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setIsEditingPinned(!isEditingPinned)} style={styles.editButton}>
            <Text style={styles.buttonText}>{isEditingPinned ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Announcement Cards */}
        <View style={styles.card}>
          {announcements.map((announcement, index) => (
            <View key={index} style={styles.announcementItem}>
              {editingAnnouncement === index ? (
                <TextInput
                  value={announcement.text}
                  onChangeText={(text) => {
                    const newAnnouncements = [...announcements];
                    newAnnouncements[index].text = text;
                    setAnnouncements(newAnnouncements);
                  }}
                  style={styles.input}
                  placeholder="Announcement text"
                />
              ) : (
                <Text style={styles.cardText}>• {announcement.text}</Text>
              )}
              {announcement.image && (
                <TouchableOpacity onPress={() => setPreviewImage(announcement.image)}>
                  <Image source={{ uri: announcement.image }} style={styles.announcementImage} />
                </TouchableOpacity>
              )}
              <View style={styles.cardActions}>
                 <TouchableOpacity onPress={() => pickImage((uri) => {
                  const newAnnouncements = [...announcements];
                  newAnnouncements[index].image = uri;
                  setAnnouncements(newAnnouncements);
                  // Optionally save immediately or wait for save
                })} style={styles.imageButton}>
                  <Text style={styles.buttonText}>Pick Image</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                  if (editingAnnouncement === index) {
                    try {
                      await apiClient.put(`/announcements/${announcement.id}`, { text: announcement.text, image: announcement.image });
                      setEditingAnnouncement(null);
                      fetchData();
                    } catch (error) {
                      Alert.alert('Error', 'Failed to update announcement');
                    }
                  } else {
                    setEditingAnnouncement(index);
                  }
                }} style={styles.actionButton}>
                  <Text style={styles.actionText}>{editingAnnouncement === index ? 'Save Text' : 'Edit Text'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                  try {
                    await apiClient.delete(`/announcements/${announcement.id}`);
                    fetchData();
                  } catch (error) {
                    Alert.alert('Error', 'Failed to delete announcement');
                  }
                }} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {isAddingAnnouncement ? (
          <View style={styles.newItemContainer}>
            <TextInput
              value={newAnnouncement.text}
              onChangeText={(text) => setNewAnnouncement({ ...newAnnouncement, text })}
              style={styles.input}
              placeholder="New announcement..."
            />
            <TouchableOpacity onPress={() => pickImage((uri) => setNewAnnouncement({ ...newAnnouncement, image: uri }))} style={styles.imageButton}>
              <Text style={styles.buttonText}>Pick Image</Text>
            </TouchableOpacity>
            {newAnnouncement.image && (
              <Image source={{ uri: newAnnouncement.image }} style={styles.newImage} />
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={async () => {
                try {
                  const res = await apiClient.post('/announcements', newAnnouncement);
                  setAnnouncements(prev => [res.data, ...prev]);
                  setNewAnnouncement({ text: "", image: null });
                  setIsAddingAnnouncement(false);
                } catch (error) {
                  Alert.alert('Error', 'Failed to add announcement');
                }
              }} style={styles.addButton}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setNewAnnouncement({ text: "", image: null }); setIsAddingAnnouncement(false); }} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsAddingAnnouncement(true)} style={styles.addItemButton}>
            <Text style={styles.buttonText}>Add Announcement</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>

        {events.map((event, index) => (
          <View key={index} style={styles.card}>
            {editingEvent === index ? (
              <View style={styles.editContainer}>
                <TextInput
                  value={event.title}
                  onChangeText={(title) => {
                    const newEvents = [...events];
                    newEvents[index].title = title;
                    setEvents(newEvents);
                  }}
                  style={styles.input}
                  placeholder="Event title"
                />
                <TextInput
                  value={event.date}
                  onChangeText={(date) => {
                    const newEvents = [...events];
                    newEvents[index].date = date;
                    setEvents(newEvents);
                  }}
                  style={styles.input}
                  placeholder="Date"
                />
              </View>
            ) : (
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{event.title}</Text>
                <Text style={styles.cardSubtitle}>Date: {event.date}</Text>
              </View>
            )}
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={async () => {
                if (editingEvent === index) {
                  try {
                    await apiClient.put(`/events/${event.id}`, { title: event.title, date: event.date });
                    setEditingEvent(null);
                    fetchData();
                  } catch (error) {
                    Alert.alert('Error', 'Failed to update event');
                  }
                } else {
                  setEditingEvent(index);
                }
              }} style={styles.actionButton}>
                <Text style={styles.actionText}>{editingEvent === index ? 'Save' : 'Edit'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={async () => {
                try {
                  await apiClient.delete(`/events/${event.id}`);
                  fetchData();
                } catch (error) {
                  Alert.alert('Error', 'Failed to delete event');
                }
              }} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {isAddingEvent ? (
          <View style={styles.newItemContainer}>
            <TextInput
              value={newEvent.title}
              onChangeText={(title) => setNewEvent({ ...newEvent, title })}
              style={styles.input}
              placeholder="Event title..."
            />
            <TextInput
              value={newEvent.date}
              onChangeText={(date) => setNewEvent({ ...newEvent, date })}
              style={styles.input}
              placeholder="Date..."
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={async () => {
                try {
                  const res = await apiClient.post('/events', newEvent);
                  setEvents(prev => [res.data, ...prev]);
                  setNewEvent({ title: "", date: "" });
                  setIsAddingEvent(false);
                } catch (error) {
                  Alert.alert('Error', 'Failed to add event');
                }
              }} style={styles.addButton}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setNewEvent({ title: "", date: "" }); setIsAddingEvent(false); }} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsAddingEvent(true)} style={styles.addItemButton}>
            <Text style={styles.buttonText}>Add Event</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Group Leaders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Group Leaders / Mentors</Text>

        {leaders.map((leader, index) => (
          <View key={index} style={styles.card}>
            {editingLeader === index ? (
              <View style={styles.editContainer}>
                <TextInput
                  value={leader.name}
                  onChangeText={(name) => {
                    const newLeaders = [...leaders];
                    newLeaders[index].name = name;
                    setLeaders(newLeaders);
                  }}
                  style={styles.input}
                  placeholder="Name"
                />
                <TextInput
                  value={leader.role}
                  onChangeText={(role) => {
                    const newLeaders = [...leaders];
                    newLeaders[index].role = role;
                    setLeaders(newLeaders);
                  }}
                  style={styles.input}
                  placeholder="Role"
                />
              </View>
            ) : (
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{leader.name}</Text>
                <Text style={styles.cardSubtitle}>{leader.role}</Text>
              </View>
            )}
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => setEditingLeader(editingLeader === index ? null : index)} style={styles.actionButton}>
                <Text style={styles.actionText}>{editingLeader === index ? 'Save' : 'Edit'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLeaders(leaders.filter((_, i) => i !== index))} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {isAddingLeader ? (
          <View style={styles.newItemContainer}>
            <TextInput
              value={newLeader.name}
              onChangeText={(name) => setNewLeader({ ...newLeader, name })}
              style={styles.input}
              placeholder="Name..."
            />
            <TextInput
              value={newLeader.role}
              onChangeText={(role) => setNewLeader({ ...newLeader, role })}
              style={styles.input}
              placeholder="Role..."
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => {
                setLeaders([...leaders, newLeader]);
                setNewLeader({ name: "", role: "" });
                setIsAddingLeader(false);
              }} style={styles.addButton}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setNewLeader({ name: "", role: "" }); setIsAddingLeader(false); }} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsAddingLeader(true)} style={styles.addItemButton}>
            <Text style={styles.buttonText}>Add Leader</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Contact Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        {isEditingContact ? (
          <View style={styles.editContainer}>
            <Text>Youth Coordinator:</Text>
            <TextInput
              value={contact.coordinator}
              onChangeText={(coordinator) => setContact({ ...contact, coordinator })}
              style={styles.input}
            />
            <Text>Email:</Text>
            <TextInput
              value={contact.email}
              onChangeText={(email) => setContact({ ...contact, email })}
              style={styles.input}
              keyboardType="email-address"
            />
            <Text>Phone:</Text>
            <TextInput
              value={contact.phone}
              onChangeText={(phone) => setContact({ ...contact, phone })}
              style={styles.input}
            />
          </View>
        ) : (
          <View>
            <Text><Text style={styles.bold}>Youth Coordinator:</Text> {contact.coordinator}</Text>
            <Text>Email: {contact.email}</Text>
            <Text>Phone: {contact.phone}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => setIsEditingContact(!isEditingContact)} style={styles.addItemButton}>
          <Text style={styles.buttonText}>{isEditingContact ? 'Save Contact' : 'Edit Contact'}</Text>
        </TouchableOpacity>
      </View>

            {/* Image Preview Modal */}
            <ImagePreviewModal
              image={previewImage}
              onClose={() => setPreviewImage(null)}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 10,
  },
  intro: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 16,
  },
  pinnedContainer: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinnedContent: {
    flex: 1,
  },
  editButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  announcementItem: {
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    fontWeight: '500',
    color: '#3b2a20',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#3b2a20',
  },
  cardSubtitle: {
    color: '#6b7280',
  },
  announcementImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
  },
  newItemContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  imageButton: {
    backgroundColor: '#3b82f6',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  newImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#10b981',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
  },
  addItemButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  editContainer: {
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
});