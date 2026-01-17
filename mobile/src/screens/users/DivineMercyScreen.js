import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import TopBar from '../../components/TopBar';

export default function DivineMercyScreen() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'intro',
      title: 'Intro',
      content: `You expired, Jesus, but the source of life gushed forth for souls...

O Blood and Water, which gushed forth from the Heart of Jesus as a fount of mercy for us, I trust in You.`,
    },
    {
      id: 'opening',
      title: 'Opening Prayers',
      content: `Our Father...
Hail Mary...
The Apostles' Creed...`,
    },
    {
      id: 'chaplet',
      title: 'The Chaplet',
      content: `Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, our Lord Jesus Christ...

For the sake of His sorrowful Passion, have mercy on us and on the whole world.`,
    },
    {
      id: 'closing',
      title: 'Closing Prayer',
      content: `Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.`,
    },
  ];

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Swinging Cross Icon */}
        <View style={styles.crossContainer}>
          <Text style={styles.crossText}>✝</Text>
        </View>

        <Text style={styles.pageTitle}>Divine Mercy Chaplet</Text>
        <Text style={styles.subtitle}>"Have mercy on us and on the whole world."</Text>

        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.expandIcon}>{expandedSection === section.id ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expandedSection === section.id && (
              <View style={styles.sectionContent}>
                {section.content.split('\n').map((line, idx) => (
                  line.trim() && <Text key={idx} style={styles.contentText}>{line}</Text>
                ))}
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
  crossContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  crossText: {
    fontSize: 48,
    color: '#6b4a2d',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3a2c1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#3a2c1a',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3a2c1a',
  },
  expandIcon: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  contentText: {
    fontSize: 14,
    color: '#3a2c1a',
    lineHeight: 22,
    marginBottom: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

