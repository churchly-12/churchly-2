import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import TopBar from '../../components/TopBar';

export default function NovenasScreen() {
  const [expandedNovena, setExpandedNovena] = useState(null);

  const toggleNovena = (index) => {
    setExpandedNovena(expandedNovena === index ? null : index);
  };

  const novenas = [
    {
      title: 'Novena to the Sacred Heart of Jesus',
      text: `Leader: In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.

All: O most holy Heart of Jesus, fountain of every blessing, I adore You, I love You, and with a lively sorrow for my sins, I offer You this poor heart of mine. (Kneel)

Leader: Make me humble, patient, pure, and wholly obedient to Your will. Grant, Good Jesus, that I may live in You and for You. (Rise)

All: Protect me in life and in death. Amen.
(Our Father, Hail Mary, Glory Be)`,
    },
    {
      title: 'Novena to Our Lady of Perpetual Help',
      text: `Leader: O Mother of Perpetual Help, we come before You with trust and devotion. (Kneel)

All: Look upon us with mercy and aid us in all our necessities. Comfort the afflicted, guide the sinner, and protect the faithful. (Rise)

Leader: We place all our hope in Your loving care. Help us to grow in holiness each day. (Kneel)

All: Amen.
(Our Father, Hail Mary, Glory Be)`,
    },
    {
      title: 'Novena to St. Jude Thaddeus',
      text: `Leader: Glorious Apostle, St. Jude, faithful servant and friend of Jesus, (Kneel)

All: Pray for us, and grant us the grace to persevere in hope. Assist us in our present needs. (Rise)

Leader: May we receive consolation in our trials and guidance in our troubles. (Kneel)

All: Amen.
(Our Father, Hail Mary, Glory Be)`,
    },
    {
      title: 'Novena to the Holy Spirit',
      text: `Leader: Come, Holy Spirit, fill the hearts of Your faithful and enkindle in them the fire of Your love. (Kneel)

All: Send forth Your Spirit and they shall be created, and You shall renew the face of the earth. (Rise)

Leader: Grant us the gifts of wisdom, understanding, counsel, fortitude, knowledge, piety, and fear of the Lord. (Kneel)

All: Amen.
(Our Father, Hail Mary, Glory Be)`,
    },
  ];

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Novenas</Text>
        <Text style={styles.subtitle}>Pray these novenas for intercession and grace</Text>

        {novenas.map((novena, index) => (
          <View key={index} style={styles.novenaCard}>
            <TouchableOpacity
              style={styles.novenaHeader}
              onPress={() => toggleNovena(index)}
            >
              <Text style={styles.novenaTitle}>{novena.title}</Text>
              <Text style={styles.expandIcon}>{expandedNovena === index ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expandedNovena === index && (
              <View style={styles.novenaContent}>
                <Text style={styles.novenaText}>{novena.text}</Text>
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
  novenaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  novenaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  novenaTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3a2c1a',
    flex: 1,
    paddingRight: 8,
  },
  expandIcon: {
    fontSize: 12,
    color: '#6b7280',
  },
  novenaContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  novenaText: {
    fontSize: 13,
    color: '#3a2c1a',
    lineHeight: 20,
    whiteSpacePreLine: true,
  },
  bottomPadding: {
    height: 20,
  },
});
