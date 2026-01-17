import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/apiClient';
import TopBar from '../../components/TopBar';

const REACTIONS = [
  { type: "praise", icon: "🙌", label: "Praise" },
  { type: "amen", icon: "✝️", label: "Amen" },
  { type: "thanks", icon: "🙏", label: "Thanks" }
];

export default function TestimonialDetailsScreen({ route, navigation }) {
  const { testimonyId } = route.params;
  const [testimony, setTestimony] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchTestimony = useCallback(async () => {
    try {
      setError(null);
      const response = await apiClient.get(`/api/testimonies/${testimonyId}`);
      if (response.data.success) {
        setTestimony(response.data.testimony);
      } else {
        setError("Failed to load testimony.");
      }
    } catch (err) {
      setError("Failed to load testimony.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [testimonyId]);

  useEffect(() => {
    fetchTestimony();
  }, [fetchTestimony]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTestimony();
  }, [fetchTestimony]);

  const handleReact = async (reactionType) => {
    try {
      await apiClient.post(`/api/testimonies/${testimonyId}/react`, { reaction: reactionType });
      fetchTestimony();
    } catch (err) {
      console.error('Reaction failed', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.centerContent}>
          <Text>Loading testimony...</Text>
        </View>
      </View>
    );
  }

  if (error || !testimony) {
    return (
      <View style={styles.container}>
        <TopBar />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{error || "Testimony not found"}</Text>
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
        {/* Testimony Content */}
        <View style={styles.testimonyCard}>
          <View style={styles.testimonyHeader}>
            <Text style={styles.testimonyUser}>
              {testimony.anonymous ? "Anonymous" : testimony.userName}
            </Text>
            <Text style={styles.testimonyDate}>
              {new Date(testimony.createdAt).toLocaleString()}
            </Text>
          </View>

          <Text style={styles.testimonyContent}>{testimony.content}</Text>

          {/* Reaction Buttons */}
          <View style={styles.reactions}>
            {REACTIONS.map(r => (
              <TouchableOpacity
                key={r.type}
                style={[
                  styles.reactionButton,
                  testimony.userReaction === r.type && styles.reactionButtonActive
                ]}
                onPress={() => handleReact(r.type)}
              >
                <Text style={styles.reactionText}>
                  {r.icon} {testimony.reactions?.[r.type] || 0} {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Encouragement Message */}
        <View style={styles.encouragementCard}>
          <Ionicons name="heart" size={24} color="#dc2626" />
          <Text style={styles.encouragementText}>
            "I can do all things through Christ who strengthens me." - Philippians 4:13
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffbeb',
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
  testimonyCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  testimonyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  testimonyUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
  },
  testimonyDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  testimonyContent: {
    fontSize: 18,
    color: '#374151',
    lineHeight: 28,
    marginBottom: 16,
  },
  reactions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  reactionButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  reactionButtonActive: {
    backgroundColor: '#eab308',
  },
  reactionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  encouragementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  encouragementText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});

