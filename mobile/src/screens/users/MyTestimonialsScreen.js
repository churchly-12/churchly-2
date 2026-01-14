import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { deleteTestimony } from '../../services/testimonyService';
import TopBar from '../../components/TopBar';

export default function MyTestimonialsScreen({ navigation }) {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/testimonies/my');
      setTestimonials(res.data.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      Alert.alert('Error', 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log("🔥 DELETE STARTED FOR:", id);

    try {
      console.log("🗑️ ATTEMPTING TO DELETE TESTIMONY:", id);
      const res = await deleteTestimony(id);
      console.log("📊 DELETE RESPONSE:", res);
      if (res.success) {
        console.log("✅ DELETE SUCCESSFUL - REMOVING FROM UI");
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        Alert.alert("Success", `Testimony deleted (ID: ${id})`);
      } else {
        console.log("❌ DELETE FAILED:", res.message);
        Alert.alert("Delete failed", res.message || "Failed to delete testimony");
      }
    } catch (err) {
      console.log("💥 DELETE ERROR:", err.response?.data || err.message);
      Alert.alert("Delete failed", JSON.stringify(err.response?.data));
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>My Testimonials</Text>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#3b2a20" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : testimonials.length === 0 ? (
          <Text style={styles.emptyText}>No testimonials found.</Text>
        ) : (
          testimonials.map((testimonial) => (
            <View key={testimonial.id} style={styles.card}>
              <Text style={styles.testimonialText}>{testimonial.content}</Text>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Debug', 'Delete button pressed');
                  console.log('Delete button clicked for ID:', testimonial.id);
                  console.log('Testimonial object:', testimonial);
                  handleDelete(testimonial.id);
                }}
                style={styles.deleteButton}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                activeOpacity={0.5}
              >
                <Ionicons name="trash" size={20} color="#dc2626" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Refresh Button */}
      <View style={styles.refreshContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchTestimonials}>
          <Text style={styles.refreshButtonText}>Refresh Testimonials</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 20,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 50,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testimonialText: {
    flex: 1,
    fontSize: 16,
    color: '#3b2a20',
  },
  deleteButton: {
    padding: 8,
    zIndex: 10,
  },
  refreshContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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