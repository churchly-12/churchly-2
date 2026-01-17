import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import TopBar from '../../components/TopBar';

export default function ShortPrayersScreen() {
  const [expandedPrayer, setExpandedPrayer] = useState(null);

  const togglePrayer = (index) => {
    setExpandedPrayer(expandedPrayer === index ? null : index);
  };

  const prayers = [
    {
      title: 'Prayer Before Meals',
      text: `Leader: Bless us, O Lord, and these Thy gifts,
which we are about to receive from Thy bounty, (Kneel)

All: Through Christ our Lord. Amen.`,
    },
    {
      title: 'Prayer After Meals',
      text: `Leader: We give You thanks, Almighty God,
for all Your benefits, (Kneel)

All: Who live and reign forever. Amen.`,
    },
    {
      title: 'Morning Offering',
      text: `Leader: O Jesus, through the Immaculate Heart of Mary,
I offer You my prayers, works, joys, and sufferings of this day, (Kneel)

All: In union with the Holy Sacrifice of the Mass throughout the world. Amen.`,
    },
    {
      title: 'Prayer Before Sleep',
      text: `Leader: O Lord, I offer You my soul and body this night. (Kneel)

All: Protect me through the night, and forgive all my sins. Amen.`,
    },
  ];

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Short Prayers</Text>
        <Text style={styles.subtitle}>Quick prayers for daily devotion</Text>

        {prayers.map((prayer, index) => (
          <View key={index} style={styles.prayerCard}>
            <TouchableOpacity
              style={styles.prayerHeader}
              onPress={() => togglePrayer(index)}
            >
              <Text style={styles.prayerTitle}>{prayer.title}</Text>
              <Text style={styles.expandIcon}>{expandedPrayer === index ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expandedPrayer === index && (
              <View style={styles.prayerContent}>
                <Text style={styles.prayerText}>{prayer.text}</Text>
              </View>
            )}
          </View>
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e8d8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3a2c1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#3a2c1a',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 16,
  },
  prayerCard: {
    backgroundColor: '#fdf5e6',
    borderLeftWidth: 8,
    borderLeftColor: '#c6ad92',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  prayerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b2a20',
  },
  expandIcon: {
    fontSize: 12,
    color: '#6b7280',
  },
  prayerContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  prayerText: {
    fontSize: 14,
    color: '#3b2a20',
    lineHeight: 22,
    whiteSpacePreLine: true,
  },
  bottomPadding: {
    height: 20,
  },
});

