import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import TopBar from '../../components/TopBar';

export default function FastingGuideScreen() {
  const [expandedGuide, setExpandedGuide] = useState(null);

  const toggleGuide = (index) => {
    setExpandedGuide(expandedGuide === index ? null : index);
  };

  const guides = [
    {
      title: 'Fasting Rules',
      text: `Leader: On Ash Wednesday and Good Friday, Catholics aged 18-59 are called to fast. (Kneel)

All: Fasting means taking only one full meal and two smaller meals that together do not equal a full meal.
No eating between meals. (Rise)`,
    },
    {
      title: 'Abstinence Rules',
      text: `Leader: All Fridays of Lent, and Ash Wednesday, all Catholics aged 14 and older should abstain from meat. (Kneel)

All: Abstinence means refraining from eating meat, but eggs, milk products, and fish are allowed. (Rise)`,
    },
    {
      title: 'Exceptions',
      text: `Leader: The sick, pregnant or nursing women, and young children are exempt from fasting and abstinence. (Kneel)

All: Individuals should substitute with acts of charity or prayer if unable to fast or abstain. (Rise)`,
    },
    {
      title: 'Purpose',
      text: `Leader: Fasting and abstinence help us grow in self-discipline, charity, and spiritual focus. (Kneel)

All: Through these practices, we unite our sacrifices with Christ's Passion and prepare our hearts for Easter. (Rise)`,
    },
  ];

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Fasting and Abstinence Guide</Text>
        <Text style={styles.subtitle}>Practical guide for Catholic fasting and abstinence</Text>

        {guides.map((guide, index) => (
          <View key={index} style={styles.guideCard}>
            <TouchableOpacity
              style={styles.guideHeader}
              onPress={() => toggleGuide(index)}
            >
              <Text style={styles.guideTitle}>{guide.title}</Text>
              <Text style={styles.expandIcon}>{expandedGuide === index ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expandedGuide === index && (
              <View style={styles.guideContent}>
                <Text style={styles.guideText}>{guide.text}</Text>
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
  guideCard: {
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
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b2a20',
  },
  expandIcon: {
    fontSize: 12,
    color: '#6b7280',
  },
  guideContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  },
  guideText: {
    fontSize: 14,
    color: '#3b2a20',
    lineHeight: 22,
    whiteSpacePreLine: true,
  },
  bottomPadding: {
    height: 20,
  },
});

