import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import TopBar from '../../components/TopBar';

const REACTIONS = [
  { type: "praise", icon: "🙌", label: "Praise" },
  { type: "amen", icon: "✝️", label: "Amen" },
  { type: "thanks", icon: "🙏", label: "Thanks" }
];

export default function TestimonialsScreen({ navigation }) {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchTestimonies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/api/testimonies/');
      if (response.data.success) {
        setTestimonies(response.data.data || []);
      } else {
        setTestimonies([]);
      }
    } catch (err) {
      setError('Failed to load testimonies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReact = async (testimonyId, reactionType) => {
    try {
      await apiClient.post(`/api/testimonies/${testimonyId}/react`, { reaction: reactionType });
      fetchTestimonies();
    } catch (err) {
      console.error('Reaction failed', err);
    }
  };

  useEffect(() => {
    fetchTestimonies();
  }, []);

  return (
    <View style={styles.container}>
      <TopBar />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ Testimonials</Text>
      </View>

      {/* Description */}
      <View style={styles.description}>
        <Text style={styles.descriptionText}>
          Share what God has done in your life
        </Text>
      </View>

      {/* Refresh Button */}
      <View style={styles.refreshContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchTestimonies}>
          <Text style={styles.refreshButtonText}>Refresh Testimonies</Text>
        </TouchableOpacity>
      </View>

      {/* Testimonials List */}
      <ScrollView style={styles.testimoniesList} contentContainerStyle={styles.testimoniesListContent}>
        {loading ? (
          <Text style={styles.centerText}>Loading testimonies...</Text>
        ) : error ? (
          <Text style={styles.centerText}>{error}</Text>
        ) : testimonies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No testimonies yet.</Text>
            <Text style={styles.emptySubtext}>Be the first to share your story!</Text>
          </View>
        ) : (
          testimonies.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={styles.testimonyCard}
              onPress={() => navigation.navigate('TestimonialDetails', { testimonyId: t.id })}
            >
              <View style={styles.testimonyHeader}>
                <Text style={styles.testimonyUser}>
                  {t.anonymous ? "Anonymous" : t.userName}
                </Text>
                <Text style={styles.testimonyDate}>
                  {new Date(t.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <Text style={styles.testimonyContent} numberOfLines={3}>{t.content}</Text>

              {/* Reaction Buttons */}
              <View style={styles.reactions}>
                {REACTIONS.map(r => (
                  <TouchableOpacity
                    key={r.type}
                    style={[
                      styles.reactionButton,
                      t.userReaction === r.type && styles.reactionButtonActive
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleReact(t.id, r.type);
                    }}
                  >
                    <Text style={styles.reactionText}>
                      {r.icon} {t.reactions?.[r.type] || 0}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NewTestimonial')}
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
  refreshContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#eab308',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  testimoniesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  testimoniesListContent: {
    paddingBottom: 100,
  },
  centerText: {
    textAlign: 'center',
    padding: 32,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
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
    marginBottom: 12,
  },
  testimonyUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  testimonyDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  testimonyContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  reactions: {
    flexDirection: 'row',
    gap: 8,
  },
  reactionButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reactionButtonActive: {
    backgroundColor: '#eab308',
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
    backgroundColor: '#eab308',
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
});

