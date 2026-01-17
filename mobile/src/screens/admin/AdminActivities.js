import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AdminTopBar from '../../components/AdminTopBar';

export default function AdminActivities() {
  const navigation = useNavigation();

  const items = [
    {
      title: "Youth Groups",
      desc: "Prayer groups, choir, bible circles, youth meetups.",
      iconName: "people"
    },
    {
      title: "Community Groups",
      desc: "Women's groups, men's groups, family cells, outreach teams.",
      iconName: "people-circle"
    },
    {
      title: "Sports & Events",
      desc: "Tournaments, indoor & outdoor games, parish fun events.",
      iconName: "fitness"
    },
    {
      title: "Retreats / Camps / Pilgrimages",
      desc: "Church retreats, youth camps, one-day and long pilgrimages.",
      iconName: "location"
    },
    {
      title: "Workshops",
      desc: "Skill development, bible formation, choir training, liturgy.",
      iconName: "construct"
    },
    {
      title: "Weekly Announcements",
      desc: "Mass schedules, notices, community updates.",
      iconName: "megaphone"
    },
    {
      title: "Sacramental Services",
      desc: "Baptism, Marriage Banns, First Communion, Confirmation, RCIA.",
      iconName: "book"
    }
  ];

  const handlePress = (item) => {
    if (item.title === "Youth Groups") {
      navigation.navigate('AdminYouthGroups');
    } else {
      Alert.alert('Coming Soon', `${item.title} will be available soon.`);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.iconName} size={24} color="#64748b" />
      </View>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
        </View>
        <Text style={styles.desc}>{item.desc}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AdminTopBar />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Activities</Text>
          <Text style={styles.subtitle}>
            Get involved — find groups, events and sacramental services.
          </Text>
        </View>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
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
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  desc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
});