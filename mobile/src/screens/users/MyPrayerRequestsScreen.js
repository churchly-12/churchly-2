import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { fetchPrayers, deletePrayer } from '../../services/prayerService';
import apiClient from '../../api/apiClient';
import TopBar from '../../components/TopBar';

export default function MyPrayerRequestsScreen({ navigation }) {
  const { user } = useAuth();
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayerRequests();
  }, [user]);

  const fetchPrayerRequests = async () => {
    console.log('🔍 FETCHING PRAYER REQUESTS - User:', user);
    setLoading(true);
    try {
      console.log('📡 MAKING API CALL TO /api/prayers/my-prayers');
      const res = await apiClient.get('/api/prayers/my-prayers');
      console.log('✅ API Response received:', res.data);
      console.log('📊 Data array length:', res.data.data?.length || 0);
      setPrayerRequests(res.data.data || []);
      console.log('💾 State updated with prayers');
    } catch (error) {
      console.error('❌ Error fetching prayer requests:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      Alert.alert('Error', 'Failed to load prayer requests');
    } finally {
      setLoading(false);
      console.log('🔄 Loading set to false');
    }
  };

  const handleDelete = async (id) => {
    console.log('Delete button pressed for ID:', id);
    try {
      console.log('🗑️ ATTEMPTING TO DELETE PRAYER:', id);
      const response = await deletePrayer(id);
      console.log('📊 DELETE RESPONSE:', response);
      if (response.success) {
        console.log('✅ DELETE SUCCESSFUL - REMOVING FROM UI');
        setPrayerRequests(prayerRequests.filter(p => p.id !== id));
        Alert.alert('Success', `Prayer request deleted (ID: ${id})`);
      } else {
        console.log('❌ DELETE FAILED:', response.message);
        Alert.alert('Error', response.message || 'Failed to delete prayer request');
      }
    } catch (error) {
      console.error('💥 DELETE ERROR:', error.response ? error.response.data : error.message);
      console.error('📋 ERROR STATUS:', error.response ? error.response.status : 'No status');
      Alert.alert('Error', 'Failed to delete prayer request');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.requestText}>{item.content}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log('Delete button clicked for ID:', item.id);
          alert('Delete button clicked for ID: ' + item.id);
          handleDelete(item.id);
        }}
        style={styles.deleteButton}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons name="trash" size={20} color="#dc2626" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar />
      <Text style={styles.title}>My Prayer Requests</Text>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#3b2a20" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={prayerRequests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No prayer requests found.</Text>}
          contentContainerStyle={styles.content}
        />
      )}
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
  },
  requestText: {
    flex: 1,
    fontSize: 16,
    color: '#3b2a20',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 6,
  },
  deleteText: {
    color: '#dc2626',
    marginLeft: 4,
    fontSize: 14,
  },
});