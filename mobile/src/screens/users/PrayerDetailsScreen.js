import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPrayerById, respondToPrayer, reactToPrayer } from '../../services/prayerService';
import TopBar from '../../components/TopBar';

const REACTIONS = [
  { type: "prayed", icon: "🙏", label: "Prayed" },
  { type: "amen", icon: "✝️", label: "Amen" },
  { type: "peace", icon: "🕊️", label: "Peace" }
];

export default function PrayerDetailsScreen({ route, navigation }) {
  const { prayerId } = route.params;
  const [prayer, setPrayer] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrayer = useCallback(async () => {
    try {
      setError(null);
      const data = await getPrayerById(prayerId);
      if (data.success) {
        setPrayer(data.prayer);
      } else {
        setError("Failed to load prayer details.");
      }
    } catch (err) {
      setError("Failed to load prayer details.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [prayerId]);

  useEffect(() => {
    fetchPrayer();
  }, [fetchPrayer]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPrayer();
  }, [fetchPrayer]);

  const handleResponseSubmit = async () => {
    if (!responseText.trim()) return;

    try {
      setSubmitting(true);
      const res = await respondToPrayer(prayerId, { message: responseText.trim() });
      
      if (res.success) {
        setPrayer((prev) => ({
          ...prev,
          responses: [...(prev.responses || []), res.response],
        }));
        setResponseText("");
        Alert.alert('Success', 'Your response has been added!');
      } else {
        Alert.alert('Error', res.message || 'Failed to add response');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReact = async (reactionType) => {
    try {
      await reactToPrayer(prayerId, reactionType);
      fetchPrayer();
    } catch (err) {
      console.error('Reaction failed', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.centerContent}>
          <Text>Loading prayer...</Text>
        </View>
      </View>
    );
  }

  if (error || !prayer) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error || "Prayer not found"}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Prayer Content */}
        <View style={styles.prayerCard}>
          <Text style={styles.prayerUser}>
            {prayer.anonymous ? "Anonymous" : prayer.userName}
          </Text>
          <Text style={styles.prayerTitle}>{prayer.title}</Text>
          <Text style={styles.prayerText}>{prayer.requestText}</Text>
          <Text style={styles.prayerDate}>
            {new Date(prayer.createdAt).toLocaleString()}
          </Text>
          <Text style={styles.approvedText}>Approved</Text>

          {/* Reaction Buttons */}
          <View style={styles.reactions}>
            {REACTIONS.map(r => (
              <TouchableOpacity
                key={r.type}
                style={[
                  styles.reactionButton,
                  prayer.userReaction === r.type && styles.reactionButtonActive
                ]}
                onPress={() => handleReact(r.type)}
              >
                <Text style={styles.reactionText}>
                  {r.icon} {prayer.reactions?.[r.type] || 0}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Responses Section */}
        <Text style={styles.sectionTitle}>Responses ({prayer.responses?.length || 0})</Text>
        
        {prayer.responses?.filter(r => r.approved !== false).length === 0 ? (
          <Text style={styles.noResponsesText}>No responses yet. Be the first to pray!</Text>
        ) : (
          prayer.responses?.filter(r => r.approved !== false).map((res, idx) => (
            <View key={idx} style={styles.responseCard}>
              <View style={styles.responseHeader}>
                <Text style={styles.responseUser}>
                  {res.anonymous ? "Anonymous" : res.userName}
                </Text>
                <Text style={styles.responseTime}>
                  {new Date(res.time).toLocaleString()}
                </Text>
              </View>
              <Text style={styles.responseText}>{res.responseText}</Text>
            </View>
          ))
        )}

        {/* Add Response Section */}
        <View style={styles.addResponseSection}>
          <Text style={styles.sectionTitle}>Add Your Response</Text>
          <TextInput
            style={styles.responseInput}
            value={responseText}
            onChangeText={setResponseText}
            placeholder="Write a prayer or encouraging message..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleResponseSubmit}
            disabled={submitting || !responseText.trim()}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Sending...' : 'Send Response'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
  },
  prayerCard: {
    backgroundColor: 'white',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6F4E37',
    marginBottom: 8,
  },
  prayerText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
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
  reactions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  noResponsesText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: 20,
    fontStyle: 'italic',
  },
  responseCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  responseUser: {
    fontWeight: '600',
    color: '#374151',
  },
  responseTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  responseText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  addResponseSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  responseInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#6F4E37',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
