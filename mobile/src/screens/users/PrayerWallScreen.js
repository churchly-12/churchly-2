import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { fetchPrayers, reactToPrayer } from '../../services/prayerService';
import TopBar from '../../components/TopBar';

const REACTIONS = [
  { type: "prayed", icon: "🙏", label: "Prayed" },
  { type: "amen", icon: "✝️", label: "Amen" },
  { type: "peace", icon: "🕊️", label: "Peace" }
];

export default function PrayerWallScreen({ navigation }) {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const loadPrayers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPrayers();
      setPrayers(data || []);
    } catch (err) {
      setError('Failed to load prayers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReact = async (prayerId, reactionType) => {
    try {
      await reactToPrayer(prayerId, reactionType);
      loadPrayers();
    } catch (err) {
      console.error('Reaction failed', err);
    }
  };

  useEffect(() => {
    loadPrayers();
  }, []);

  const approvedPrayers = prayers.filter(prayer => prayer.approved !== false);

  return (
    <View style={styles.container}>
      <TopBar />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🙏 Prayer Requests</Text>
      </View>

      {/* Description */}
      <View style={styles.description}>
        <Text style={styles.descriptionText}>
          Pray for others or share your own request
        </Text>
      </View>

      {/* Prayer List */}
      <ScrollView style={styles.prayerList} contentContainerStyle={styles.prayerListContent}>
        {loading ? (
          <Text style={styles.centerText}>Loading prayers...</Text>
        ) : error ? (
          <Text style={styles.centerText}>{error}</Text>
        ) : approvedPrayers.length === 0 ? (
          <Text style={styles.centerText}>No approved prayers yet.</Text>
        ) : (
          approvedPrayers.map((prayer) => (
            <TouchableOpacity
              key={prayer.id}
              style={styles.prayerCard}
              onPress={() => navigation.navigate('PrayerDetails', { prayerId: prayer.id })}
            >
              <Text style={styles.prayerUser}>
                {prayer.anonymous ? "Anonymous" : prayer.userName}
              </Text>
              <Text style={styles.prayerTitle}>{prayer.title}</Text>
              <Text style={styles.prayerText} numberOfLines={2}>{prayer.requestText}</Text>
              <Text style={styles.prayerDate}>
                {new Date(prayer.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.approvedText}>Approved</Text>

              {prayer.responses?.length > 0 && (
                <View style={styles.responses}>
                  {prayer.responses.filter(res => res.approved !== false).map((res, idx) => (
                    <Text key={idx} style={styles.responseText}>
                      <Text style={styles.responseUser}>
                        {res.anonymous ? "Anonymous" : res.userName}:
                      </Text> {res.responseText}
                    </Text>
                  ))}
                </View>
              )}

              {/* Reaction Buttons */}
              <View style={styles.reactions}>
                {REACTIONS.map(r => (
                  <TouchableOpacity
                    key={r.type}
                    style={[
                      styles.reactionButton,
                      prayer.userReaction === r.type && styles.reactionButtonActive
                    ]}
                    onPress={() => handleReact(prayer.id, r.type)}
                  >
                    <Text style={styles.reactionText}>
                      {r.icon} {prayer.reactions?.[r.type] || 0}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Refresh Button */}
      <View style={styles.refreshContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={loadPrayers}>
          <Text style={styles.refreshButtonText}>Refresh Prayers</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NewPrayerRequest')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#6F4E37',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    padding: 16,
  },
  descriptionText: {
    color: '#6b7280',
    fontSize: 14,
  },
  prayerList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  prayerListContent: {
    paddingBottom: 100,
  },
  centerText: {
    textAlign: 'center',
    padding: 32,
    color: '#6b7280',
  },
  prayerCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  prayerUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6F4E37',
    marginBottom: 8,
  },
  prayerText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 24,
  },
  prayerDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  approvedText: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 12,
  },
  responses: {
    marginTop: 12,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
  },
  responseText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  responseUser: {
    fontWeight: '600',
    color: '#374151',
  },
  reactions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  reactionButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reactionButtonActive: {
    backgroundColor: '#6F4E37',
  },
  reactionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: '#6F4E37',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
 refreshContainer: {
   paddingHorizontal: 16,
   paddingBottom: 16,
 },
 refreshButton: {
   backgroundColor: '#6F4E37',
   padding: 12,
   borderRadius: 8,
   alignItems: 'center',
 },
 refreshButtonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: '600',
 },
});
