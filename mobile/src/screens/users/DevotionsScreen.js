import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';
import RosaryIcon from '../../components/RosaryIcon';

export default function DevotionsScreen({ navigation }) {
  const items = [
    { title: "Daily Rosary", screen: "Rosary", icon: "rosary-for-praying-svgrepo-com" },
    { title: "Divine Mercy Chaplet", screen: "DivineMercy", icon: "heart" },
    { title: "Stations of the Cross", screen: "StationsOfTheCross", icon: "church" },
    { title: "Novenas", screen: "Novenas", icon: "book" },
    { title: "Daily Readings", screen: "DailyReadings", icon: "sunny" },
    { title: "Fasting & Abstinence Guide", screen: "FastingGuide", icon: "time" },
    { title: "Liturgy Calendar", screen: "LiturgyCalendar", icon: "calendar" },
    { title: "Short Prayers", screen: "ShortPrayers", icon: "list" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(item.screen)}
    >
      <View style={styles.iconContainer}>
        {item.icon === 'rosary-for-praying-svgrepo-com' && <RosaryIcon name={item.icon} size={40} color="#3b2a20" />}
        {item.icon === 'heart' && <Ionicons name={item.icon} size={40} color="#3b2a20" />}
        {item.icon === 'church' && <FontAwesome name={item.icon} size={40} color="#3b2a20" />}
        {item.icon === 'book' && <Ionicons name={item.icon} size={40} color="#3b2a20" />}
        {item.icon === 'sunny' && <Ionicons name={item.icon} size={40} color="#3b2a20" />}
        {item.icon === 'time' && <Ionicons name={item.icon} size={40} color="#3b2a20" />}
        {item.icon === 'calendar' && <Ionicons name={item.icon} size={40} color="#3b2a20" />}
        {item.icon === 'list' && <Ionicons name={item.icon} size={40} color="#3b2a20" />}
      </View>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.header}>
        <Text style={styles.title}>Devotions</Text>
        <Text style={styles.subtitle}>
          Explore prayers, readings, and spiritual practices.
        </Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
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
  grid: {
    paddingBottom: 20,
    paddingHorizontal: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    margin: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: '40%',
  },
  iconContainer: {
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b2a20',
    textAlign: 'center',
  },
});
