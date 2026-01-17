import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';

export default function ActivitiesScreen({ navigation }) {
  const items = [
    {
      title: "Youth Groups",
      desc: "Prayer groups, choir, bible circles, youth meetups.",
      icon: "people",
      navigateTo: "YouthGroups"
    },
    {
      title: "Community Groups",
      desc: "Women's groups, men's groups, family cells, outreach teams.",
      icon: "people-circle",
      navigateTo: null
    },
    {
      title: "Sports & Events",
      desc: "Tournaments, indoor & outdoor games, parish fun events.",
      icon: "football",
      navigateTo: null
    },
    {
      title: "Retreats / Camps / Pilgrimages",
      desc: "Church retreats, youth camps, one-day and long pilgrimages.",
      icon: "map",
      navigateTo: null
    },
    {
      title: "Workshops",
      desc: "Skill development, bible formation, choir training, liturgy.",
      icon: "build",
      navigateTo: null
    },
    {
      title: "Weekly Announcements",
      desc: "Mass schedules, notices, community updates.",
      icon: "megaphone",
      navigateTo: null
    },
    {
      title: "Sacramental Services",
      desc: "Baptism, Marriage Banns, First Communion, Confirmation, RCIA.",
      icon: "book",
      navigateTo: null
    }
  ];

  const handlePress = (item) => {
    if (item.navigateTo) {
      navigation.navigate(item.navigateTo);
    } else {
      // Placeholder for future implementation
      console.log("Navigate to", item.title);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
        <Text style={styles.title}>Activities</Text>
        <Text style={styles.subtitle}>
          Get involved — find groups, events and sacramental services.
        </Text>
      </View>

      <View style={styles.content}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={24} color="#6b4a2d" />
            </View>

            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={16} color="#8a6b50" />
              </View>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b4a2d',
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e8dccf',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(107,74,45,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(107,74,45,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b3426',
  },
  itemDesc: {
    fontSize: 14,
    color: '#6b4a2d',
    lineHeight: 20,
  },
});
