import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import TopBar from '../../components/TopBar';

export default function LiturgyCalendarScreen() {
  const liturgicalSeasons = [
    { name: 'Advent', period: 'November 30 - December 24', color: '#bfdbfe' },
    { name: 'Christmas', period: 'December 25 - January 6', color: '#bbf7d0' },
    { name: 'Ordinary Time', period: 'After Epiphany - Ash Wednesday', color: '#f3f4f6' },
    { name: 'Lent', period: 'Ash Wednesday - Holy Thursday', color: '#ddd6fe' },
    { name: 'Easter Triduum', period: 'Holy Thursday - Easter Sunday', color: '#fecaca' },
    { name: 'Easter', period: 'Easter Sunday - Pentecost', color: '#fef08a' },
    { name: 'Ordinary Time', period: 'After Pentecost - Advent', color: '#f3f4f6' },
  ];

  const upcomingFeasts = [
    'Immaculate Conception (December 8)',
    'Christmas (December 25)',
    'Epiphany (January 6)',
    'Ash Wednesday (February)',
    'Palm Sunday (March/April)',
    'Easter (March/April)',
    'Pentecost (May/June)',
  ];

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Liturgy Calendar</Text>
        <Text style={styles.subtitle}>Liturgical seasons and feast days</Text>

        {/* Liturgical Seasons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Liturgical Seasons</Text>
          <View style={styles.seasonsContainer}>
            {liturgicalSeasons.map((season, index) => (
              <View key={index} style={[styles.seasonCard, { backgroundColor: season.color }]}>
                <Text style={styles.seasonName}>{season.name}</Text>
                <Text style={styles.seasonPeriod}>{season.period}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Feast Days */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Feast Days</Text>
          <View style={styles.feastsContainer}>
            {upcomingFeasts.map((feast, index) => (
              <Text key={index} style={styles.feastItem}>• {feast}</Text>
            ))}
          </View>
        </View>

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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3a2c1a',
    marginBottom: 12,
  },
  seasonsContainer: {
    gap: 8,
  },
  seasonCard: {
    padding: 12,
    borderRadius: 8,
  },
  seasonName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3a2c1a',
  },
  seasonPeriod: {
    fontSize: 12,
    color: '#3a2c1a',
    opacity: 0.7,
    marginTop: 2,
  },
  feastsContainer: {
    gap: 6,
  },
  feastItem: {
    fontSize: 13,
    color: '#3a2c1a',
    lineHeight: 18,
  },
  bottomPadding: {
    height: 20,
  },
});

