import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function YouthGroupsScreen() {
  const [pinnedAnnouncement] = useState("Youth Meet happens on the first Sunday of every month.");
  const [announcements] = useState([
    { text: "Youth choir practice will resume from next week.", image: null },
    { text: "Registrations open for Youth Retreat 2025.", image: null },
    { text: "Bible study session moved to Hall B.", image: null }
  ]);
  const [events] = useState([
    { title: "Youth Retreat", date: "Jan 12" },
    { title: "Praise & Worship Practice", date: "Every Friday" },
    { title: "Bible Study", date: "Every Tuesday" },
    { title: "Monthly Youth Meet", date: "First Sunday of every month" }
  ]);
  const [leaders] = useState([
    { name: "Joseph Samuel", role: "Youth Coordinator" },
    { name: "Maria Grace", role: "Choir Lead" }
  ]);
  const [contact] = useState({
    coordinator: "Joseph Samuel",
    email: "josephsamuel@example.com",
    phone: "+91 98765 12345"
  });

  return (
    <ScrollView style={styles.container}>
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
          <Text key={index} style={styles.announcementText}>
            • {announcement.text}
          </Text>
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
  announcementText: {
    fontSize: 16,
    color: '#4b3426',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 24,
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
});