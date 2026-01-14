import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function YouthGroupsScreen() {
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState("Youth Meet happens on the first Sunday of every month.");
  const [announcements, setAnnouncements] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  // Load data from AsyncStorage and API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load local data
        const data = await AsyncStorage.getItem('youthGroupsData');
        if (data) {
          const parsed = JSON.parse(data);
          setPinnedAnnouncement(parsed.pinnedAnnouncement || pinnedAnnouncement);
          setAnnouncements(parsed.announcements || announcements);
          setEvents(parsed.events || events);
          setLeaders(parsed.leaders || leaders);
          setContact(parsed.contact || contact);
        }
        
        // Fetch announcements from API
        try {
          const response = await fetch('http://localhost:8000/announcements');
          if (response.ok) {
            const apiAnnouncements = await response.json();
            // Filter and merge announcements, using API data for images
            setAnnouncements(prev => {
              // Create a map of API announcements by text for easy lookup
              const apiAnnouncementMap = new Map();
              apiAnnouncements.forEach(apiAnn => {
                if (apiAnn.text) {
                  apiAnnouncementMap.set(apiAnn.text, apiAnn);
                }
              });
              
              // Merge: use API data when available, fall back to local
              return prev.map(localAnn => {
                const apiAnn = apiAnnouncementMap.get(localAnn.text);
                return apiAnn ? apiAnn : localAnn;
              });
            });
          } else {
            console.warn('Failed to fetch announcements from API');
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#3b2a20" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          {/* Title */}
          <Text style={styles.title}>Youth Groups</Text>

          {/* Intro */}
          <Text style={styles.intro}>
            A space for young people to grow in faith, fellowship, and service through prayer groups, choir, bible circles, and youth meetups.
          </Text>

          {/* Announcements */}
          <Text style={styles.sectionTitle}>Announcements</Text>

          {/* Pinned Announcement */}
          <View style={styles.pinnedAnnouncement}>
            <Text style={styles.pinnedText}>📌 {pinnedAnnouncement}</Text>
          </View>

          {/* Announcement Cards */}
          <View style={styles.announcementsCard}>
            {announcements.map((announcement, index) => (
              <View key={index} style={styles.announcementItem}>
                <Text style={styles.announcementText}>
                  • {announcement.text}
                </Text>
                {announcement.image && (
                  <TouchableOpacity onPress={() => setPreviewImage(announcement.image)}>
                    <Image source={{ uri: announcement.image }} style={styles.announcementImage} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

      {/* Upcoming Events */}
      <Text style={styles.sectionTitle}>Upcoming Events</Text>

      <View style={styles.eventsContainer}>
        {events.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>Date: {event.date}</Text>
          </View>
        ))}
      </View>

      {/* Group Leaders */}
      <Text style={styles.sectionTitle}>Group Leaders / Mentors</Text>

      <View style={styles.leadersContainer}>
        {leaders.map((leader, index) => (
          <View key={index} style={styles.leaderCard}>
            <Text style={styles.leaderName}>{leader.name}</Text>
            <Text style={styles.leaderRole}>{leader.role}</Text>
          </View>
        ))}
      </View>

          {/* Contact Card */}
          <Text style={styles.sectionTitle}>Contact Youth Coordinator</Text>

          <View style={styles.contactCard}>
            <Text style={styles.contactText}>
              <Text style={styles.contactLabel}>Youth Coordinator:</Text> {contact.coordinator}
            </Text>
            <Text style={styles.contactText}>Email: {contact.email}</Text>
            <Text style={styles.contactText}>Phone: {contact.phone}</Text>
          </View>

          {/* Image Preview Modal */}
          <ImagePreviewModal
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 8,
  },
  intro: {
    fontSize: 16,
    color: '#6b4a2d',
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b4a2d',
    marginBottom: 12,
    marginTop: 24,
  },
  pinnedAnnouncement: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  pinnedText: {
    color: '#92400e',
    fontSize: 16,
  },
  announcementsCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  announcementItem: {
    marginBottom: 16,
  },
  announcementText: {
    fontSize: 16,
    color: '#4b3426',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
  },
  announcementImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  eventsContainer: {
    marginBottom: 24,
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b3426',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#6b4a2d',
  },
  leadersContainer: {
    marginBottom: 24,
  },
  leaderCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b3426',
    marginBottom: 4,
  },
  leaderRole: {
    fontSize: 14,
    color: '#6b4a2d',
  },
  contactCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  contactText: {
    fontSize: 16,
    color: '#6b4a2d',
    marginBottom: 8,
    lineHeight: 24,
  },
  contactLabel: {
    fontWeight: '600',
    color: '#4b3426',
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