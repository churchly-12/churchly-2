import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import TopBar from '../../components/TopBar';

export default function DailyReadingsScreen() {
  const [expandedReading, setExpandedReading] = useState(null);

  const toggleReading = (index) => {
    setExpandedReading(expandedReading === index ? null : index);
  };

  const readings = [
    {
      title: 'First Reading',
      text: 'In the beginning, God created the heavens and the earth...',
    },
    {
      title: 'Psalm',
      text: 'The Lord is my shepherd; I shall not want...',
    },
    {
      title: 'Second Reading',
      text: 'For God so loved the world that he gave his one and only Son...',
    },
    {
      title: 'Gospel',
      text: 'In the beginning was the Word, and the Word was with God...',
    },
  ];

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Daily Readings</Text>
        <Text style={styles.subtitle}>Meditate on the Word of God</Text>

        {readings.map((reading, index) => (
          <View key={index} style={styles.readingCard}>
            <TouchableOpacity
              style={styles.readingHeader}
              onPress={() => toggleReading(index)}
            >
              <Text style={styles.readingTitle}>{reading.title}</Text>
              <Text style={styles.expandIcon}>{expandedReading === index ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expandedReading === index && (
              <View style={styles.readingContent}>
                <Text style={styles.readingText}>{reading.text}</Text>
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
  readingCard: {
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
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  readingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b2a20',
  },
  expandIcon: {
    fontSize: 12,
    color: '#6b7280',
  },
  readingContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  readingText: {
    fontSize: 14,
    color: '#3b2a20',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 20,
  },
});
