import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import TopBar from '../../components/TopBar';

export default function RosaryScreen() {
  const [selectedMystery, setSelectedMystery] = useState('auto');
  const [litanyOpen, setLitanyOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getMysteryOfDay = () => {
    const d = new Date().getDay();
    switch (d) {
      case 0: return 'Glorious Mysteries';   // Sunday
      case 1: return 'Joyful Mysteries';     // Monday
      case 2: return 'Sorrowful Mysteries';  // Tuesday
      case 3: return 'Glorious Mysteries';   // Wednesday
      case 4: return 'Luminous Mysteries';   // Thursday
      case 5: return 'Sorrowful Mysteries';  // Friday
      case 6: return 'Joyful Mysteries';     // Saturday
      default: return 'Joyful Mysteries';
    }
  };

  const mysteryData = {
    'Joyful Mysteries': [
      { title: '1. The Annunciation', scripture: 'Luke 1:26–38 — The angel Gabriel announces to Mary that she will conceive the Son of God...' },
      { title: '2. The Visitation', scripture: 'Luke 1:39–56 — Mary visits Elizabeth; the child leaps in her womb...' },
      { title: '3. The Nativity', scripture: 'Luke 2:1–20 — Jesus is born in Bethlehem; angels announce to shepherds...' },
      { title: '4. The Presentation', scripture: 'Luke 2:22–40 — Jesus is presented in the Temple; Simeon and Anna prophesy...' },
      { title: '5. The Finding in the Temple', scripture: 'Luke 2:41–52 — Jesus is found among the teachers in the Temple...' },
    ],
    'Sorrowful Mysteries': [
      { title: '1. The Agony in the Garden', scripture: 'Luke 22:39–46 — Jesus prays in agony; angels minister to Him...' },
      { title: '2. The Scourging at the Pillar', scripture: 'John 19:1 — Jesus is scourged by Pilate\'s soldiers...' },
      { title: '3. The Crowning with Thorns', scripture: 'Matthew 27:27–31 — Soldiers mock Jesus as King of the Jews...' },
      { title: '4. Carrying of the Cross', scripture: 'John 19:16–17 — Jesus carries His cross to Golgotha...' },
      { title: '5. The Crucifixion', scripture: 'Luke 23:33–49 — Jesus is crucified between two thieves...' },
    ],
    'Glorious Mysteries': [
      { title: '1. The Resurrection', scripture: 'Matthew 28:1–10 — Jesus rises from the dead; angels announce to the women...' },
      { title: '2. The Ascension', scripture: 'Acts 1:6–11 — Jesus ascends into heaven before His disciples...' },
      { title: '3. The Descent of the Holy Spirit', scripture: 'Acts 2:1–13 — The Holy Spirit descends upon the Apostles...' },
      { title: '4. The Assumption of Mary', scripture: 'Traditional Teaching — Mary is taken body and soul into heavenly glory...' },
      { title: '5. The Coronation of Mary', scripture: 'Revelation 12:1 — Mary is crowned Queen of Heaven...' },
    ],
    'Luminous Mysteries': [
      { title: '1. The Baptism of the Lord', scripture: 'Matthew 3:13–17 — Jesus is baptized in the Jordan; the Spirit descends...' },
      { title: '2. The Wedding at Cana', scripture: 'John 2:1–12 — Jesus performs His first miracle at Cana...' },
      { title: '3. Proclamation of the Kingdom', scripture: 'Mark 1:14–15 — Jesus begins His public ministry...' },
      { title: '4. The Transfiguration', scripture: 'Matthew 17:1–9 — Jesus is transfigured before Peter, James, and John...' },
      { title: '5. The Institution of the Eucharist', scripture: 'Luke 22:14–20 — Jesus institutes the Holy Eucharist...' },
    ],
  };

  const litanyLines = [
    'Lord, have mercy on us.',
    'Christ, have mercy on us.',
    'Lord, have mercy on us.',
    'Christ, hear us.',
    'Christ, graciously hear us.',
    'God the Father of Heaven, have mercy on us.',
    'God the Son, Redeemer of the world, have mercy on us.',
    'God the Holy Spirit, have mercy on us.',
    'Holy Trinity, One God, have mercy on us.',
    'Holy Mary, pray for us.',
    'Holy Mother of God, pray for us.',
    'Holy Virgin of virgins, pray for us.',
    'Mother of Christ, pray for us.',
    'Mother of divine grace, pray for us.',
    'Mother most pure, pray for us.',
    'Mother most chaste, pray for us.',
    'Mother inviolate, pray for us.',
    'Mother undefiled, pray for us.',
    'Mother most amiable, pray for us.',
    'Mother most admirable, pray for us.',
    'Mother of good counsel, pray for us.',
    'Mother of our Creator, pray for us.',
    'Mother of our Savior, pray for us.',
    'Virgin most prudent, pray for us.',
    'Virgin most venerable, pray for us.',
    'Virgin most renowned, pray for us.',
    'Virgin most powerful, pray for us.',
    'Virgin most merciful, pray for us.',
    'Virgin most faithful, pray for us.',
    'Mirror of justice, pray for us.',
    'Seat of wisdom, pray for us.',
    'Cause of our joy, pray for us.',
    'Spiritual vessel, pray for us.',
    'Vessel of honor, pray for us.',
    'Singular vessel of devotion, pray for us.',
    'Mystical rose, pray for us.',
    'Tower of David, pray for us.',
    'Tower of ivory, pray for us.',
    'House of gold, pray for us.',
    'Ark of the covenant, pray for us.',
    'Gate of Heaven, pray for us.',
    'Morning star, pray for us.',
    'Health of the sick, pray for us.',
    'Refuge of sinners, pray for us.',
    'Comforter of the afflicted, pray for us.',
    'Help of Christians, pray for us.',
    'Queen of Angels, pray for us.',
    'Queen of Patriarchs, pray for us.',
    'Queen of Prophets, pray for us.',
    'Queen of Apostles, pray for us.',
    'Queen of Martyrs, pray for us.',
    'Queen of Confessors, pray for us.',
    'Queen of Virgins, pray for us.',
    'Queen of all Saints, pray for us.',
    'Queen conceived without original sin, pray for us.',
    'Queen assumed into Heaven, pray for us.',
    'Queen of the most holy Rosary, pray for us.',
    'Queen of Peace, pray for us.',
    'Lamb of God, who takes away the sins of the world, spare us, O Lord.',
    'Lamb of God, who takes away the sins of the world, graciously hear us, O Lord.',
    'Lamb of God, who takes away the sins of the world, have mercy on us.',
    'V. Pray for us, O holy Mother of God.',
    'R. That we may be made worthy of the promises of Christ.',
    'Let us pray. O God, whose only begotten Son, by His life, death, and resurrection, has purchased for us the rewards of eternal life, grant, we beseech Thee, that meditating upon these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.',
  ];

  const displayMystery = selectedMystery === 'auto' ? getMysteryOfDay() : selectedMystery;
  const currentMysteries = mysteryData[displayMystery] || [];

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Holy Rosary</Text>
        
        {/* Mystery Selector */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mystery Mode</Text>
          <Text style={styles.cardSubtitle}>Auto–detect today's mystery or view all mysteries manually.</Text>
          
          <View style={styles.selectorRow}>
            <TouchableOpacity
              style={[styles.mysteryOption, selectedMystery === 'auto' && styles.selectedOption]}
              onPress={() => setSelectedMystery('auto')}
            >
              <Text style={[styles.optionText, selectedMystery === 'auto' && styles.selectedOptionText]}>Auto Detect</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mysteryOption, selectedMystery === 'Joyful Mysteries' && styles.selectedOption]}
              onPress={() => setSelectedMystery('Joyful Mysteries')}
            >
              <Text style={[styles.optionText, selectedMystery === 'Joyful Mysteries' && styles.selectedOptionText]}>Joyful</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mysteryOption, selectedMystery === 'Sorrowful Mysteries' && styles.selectedOption]}
              onPress={() => setSelectedMystery('Sorrowful Mysteries')}
            >
              <Text style={[styles.optionText, selectedMystery === 'Sorrowful Mysteries' && styles.selectedOptionText]}>Sorrowful</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mysteryOption, selectedMystery === 'Glorious Mysteries' && styles.selectedOption]}
              onPress={() => setSelectedMystery('Glorious Mysteries')}
            >
              <Text style={[styles.optionText, selectedMystery === 'Glorious Mysteries' && styles.selectedOptionText]}>Glorious</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mysteryOption, selectedMystery === 'Luminous Mysteries' && styles.selectedOption]}
              onPress={() => setSelectedMystery('Luminous Mysteries')}
            >
              <Text style={[styles.optionText, selectedMystery === 'Luminous Mysteries' && styles.selectedOptionText]}>Luminous</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Mystery Display */}
        <Text style={styles.sectionTitle}>{displayMystery}</Text>
        
        {currentMysteries.map((mystery, index) => (
          <View key={index} style={styles.mysteryCard}>
            <Text style={styles.mysteryTitle}>{mystery.title}</Text>
            <Text style={styles.mysteryScripture}>{mystery.scripture}</Text>
          </View>
        ))}

        {/* Litany Section */}
        <View style={styles.card}>
          <View style={styles.litanyHeader}>
            <View style={styles.crossIcon}>
              <Text style={styles.crossText}>✝</Text>
            </View>
            <View style={styles.litanyTitleContainer}>
              <Text style={styles.cardTitle}>Litany of the Blessed Virgin Mary</Text>
              <Text style={styles.cardSubtitle}>Tap to expand the litany.</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.expandButton} onPress={() => setLitanyOpen(!litanyOpen)}>
            <Text style={styles.expandButtonText}>{litanyOpen ? 'Close' : 'Expand'}</Text>
            <Text style={styles.expandIcon}>{litanyOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {litanyOpen && (
            <ScrollView style={styles.litanyContent} nestedScrollEnabled>
              {litanyLines.map((line, idx) => (
                <Text key={idx} style={styles.litanyLine}>{line}</Text>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5b3a24',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 249, 240, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 74, 45, 0.3)',
    shadowColor: '#6b4a2d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b4a2d',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#5b3a24',
    opacity: 0.8,
    marginTop: 4,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  mysteryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#e9dfd2',
  },
  selectedOption: {
    backgroundColor: '#6b4a2d',
    borderColor: '#6b4a2d',
  },
  optionText: {
    fontSize: 12,
    color: '#5b3a24',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5b3a24',
    marginBottom: 12,
    marginTop: 8,
  },
  mysteryCard: {
    backgroundColor: 'rgba(255, 249, 240, 0.9)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(107, 74, 45, 0.2)',
  },
  mysteryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5b3a24',
  },
  mysteryScripture: {
    fontSize: 13,
    color: '#3b2a20',
    marginTop: 4,
    lineHeight: 18,
  },
  litanyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crossIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(107, 74, 45, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossText: {
    fontSize: 24,
    color: '#6b4a2d',
  },
  litanyTitleContainer: {
    flex: 1,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#6b4a2d',
    borderRadius: 8,
  },
  expandButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  expandIcon: {
    color: '#fff',
    fontSize: 12,
  },
  litanyContent: {
    marginTop: 12,
    maxHeight: 280,
    paddingVertical: 8,
  },
  litanyLine: {
    fontSize: 13,
    color: '#3b2a20',
    lineHeight: 20,
    paddingVertical: 2,
  },
  bottomPadding: {
    height: 20,
  },
});

