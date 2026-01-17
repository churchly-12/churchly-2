import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';

export default function CommunityScreen() {
  const priests = [
    {
      name: "Rev. Fr. John Mathew",
      role: "Parish Priest",
    },
    {
      name: "Rev. Fr. Anthony Samuel",
      role: "Assistant Parish Priest",
    },
    {
      name: "Rev. Fr. Joseph Philip",
      role: "Assistant Parish Priest",
    }
  ];

  const parishCouncil = [
    { name: "Maria Dsouza", role: "President" },
    { name: "George Fernandes", role: "Vice President" },
    { name: "Paul Joseph", role: "Secretary" },
    { name: "Rachel Thomas", role: "Treasurer" }
  ];

  const womenCommittee = [
    { name: "Lydia Pinto", role: "Coordinator" },
    { name: "Sara John", role: "Program Lead" },
    { name: "Anita Paul", role: "Prayer Group Lead" }
  ];

  const youthMinistryTeam = [
    { name: "Kevin Rodrigues", role: "Youth Coordinator" },
    { name: "Amanda Pereira", role: "Media & Outreach Lead" },
    { name: "Jerome D'Souza", role: "Events & Logistics Lead" },
    { name: "Priya Fernandes", role: "Prayer & Formation Lead" },
    { name: "Samuel Raj", role: "Sports & Activities Lead" }
  ];

  const renderSection = (title, icon, data, showImage = false) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={20} color="#6b4a2d" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {showImage ? (
        <View style={styles.priestsContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.priestCard}>
              <View style={styles.priestImage}>
                <Ionicons name="person" size={32} color="#6b4a2d" />
              </View>
              <View style={styles.priestInfo}>
                <Text style={styles.priestName}>{item.name}</Text>
                <Text style={styles.priestRole}>{item.role}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.membersContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.memberRow}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberRole}>{item.role}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Our Community</Text>
        </View>

        <View style={styles.content}>
          {renderSection("Parish Clergy", "crown", priests, true)}
          {renderSection("Parish Pastoral Council", "shield", parishCouncil)}
          {renderSection("Women's Parish Committee", "people", womenCommittee)}
          {renderSection("Youth Ministry Team", "people-circle", youthMinistryTeam)}
        </View>
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
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b2a20',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b3426',
    marginLeft: 8,
  },
  priestsContainer: {
    gap: 12,
  },
  priestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e8dccf',
  },
  priestImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: 'rgba(107,74,45,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  priestInfo: {
    flex: 1,
  },
  priestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  priestRole: {
    fontSize: 13,
    color: '#6b4a2d',
  },
  membersContainer: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e8dccf',
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  memberRole: {
    fontSize: 13,
    color: '#6b4a2d',
  },
});

