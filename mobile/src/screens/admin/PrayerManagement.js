import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { fetchPrayers } from '../../services/prayerService';
import apiClient from '../../api/apiClient';

export default function PrayerManagement() {
  const { token, isReadOnlyAdmin } = useAuth();
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPrayers();
  }, [currentPage]);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };
      const response = await apiClient.get('/admin/prayers', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrayers(response.data.prayers);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError('Failed to fetch prayers');
      console.error('Prayers fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchPrayers();
  };

  const handleDeletePrayer = async (prayerId) => {
    Alert.alert(
      'Delete Prayer',
      'Are you sure you want to delete this prayer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/admin/prayers/${prayerId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setPrayers(prayers.filter(p => p.id !== prayerId));
            } catch (err) {
              setError('Failed to delete prayer');
              console.error('Prayer delete error:', err);
            }
          },
        },
      ]
    );
  };


  const openModal = async (prayer) => {
    setSelectedPrayer(prayer);
    // Fetch responses if not already present
    if (!prayer.responses) {
      try {
        // Assuming we can use the user endpoint for responses, but for admin, we might need to adjust
        const response = await apiClient.get(`/api/prayers/get/${prayer.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSelectedPrayer({ ...prayer, responses: response.data.prayer.responses });
      } catch (err) {
        console.error('Failed to fetch responses:', err);
        setSelectedPrayer({ ...prayer, responses: [] });
      }
    }
    setShowModal(true);
  };

  const handleDeleteResponse = async (responseId) => {
    if (isReadOnlyAdmin) return;
    Alert.alert(
      'Delete Response',
      'Are you sure you want to delete this response?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.patch(
                `/admin/prayers/respond/${responseId}`,
                { is_approved: false }, // Assuming false means delete or hide
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              // Refresh responses
              const updatedResponses = selectedPrayer.responses.filter(r => r.id !== responseId);
              setSelectedPrayer({ ...selectedPrayer, responses: updatedResponses });
            } catch (err) {
              setError('Failed to delete response');
              console.error('Response delete error:', err);
            }
          },
        },
      ]
    );
  };

  const renderPrayerItem = ({ item }) => (
    <View style={styles.prayerCard}>
      <View style={styles.prayerHeader}>
        <View style={styles.prayerInfo}>
          <Text style={styles.prayerTitle}>{item.title}</Text>
          <Text style={styles.prayerAuthor}>{item.user_name || 'Anonymous'}</Text>
          <View style={styles.prayerTags}>
            <Text style={[styles.tag, item.is_anonymous ? styles.tagYellow : styles.tagGreen]}>
              {item.is_anonymous ? 'Anonymous' : 'Public'}
            </Text>
            <Text style={[styles.tag, styles.tagBlue]}>
              {item.response_count} responses
            </Text>
          </View>
          <Text style={styles.prayerDate}>
            Created: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.prayerActions}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => openModal(item)}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, isReadOnlyAdmin && styles.disabledButton]}
            onPress={() => handleDeletePrayer(item.id)}
            disabled={isReadOnlyAdmin}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderModal = () => {
    if (!selectedPrayer) return null;

    return (
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Prayer Details</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{selectedPrayer.title}</Text>

            <Text style={styles.label}>Content</Text>
            <Text style={styles.contentText}>{selectedPrayer.content}</Text>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Author</Text>
                <Text style={styles.value}>{selectedPrayer.user_name || 'Anonymous'}</Text>
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Anonymous</Text>
                <Text style={styles.value}>{selectedPrayer.is_anonymous ? 'Yes' : 'No'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Created</Text>
                <Text style={styles.value}>
                  {new Date(selectedPrayer.created_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Responses</Text>
                <Text style={styles.value}>{selectedPrayer.response_count}</Text>
              </View>
            </View>

            {selectedPrayer.responses && selectedPrayer.responses.length > 0 && (
              <View>
                <Text style={styles.label}>Responses ({selectedPrayer.responses.length})</Text>
                {selectedPrayer.responses.map((response) => (
                  <View key={response.id} style={styles.responseItem}>
                    <Text style={styles.responseText}>{response.responseText}</Text>
                    <Text style={styles.responseDate}>
                      {new Date(response.time).toLocaleDateString()}
                    </Text>
                    <TouchableOpacity
                      style={[styles.deleteResponseButton, isReadOnlyAdmin && styles.disabledButton]}
                      onPress={() => handleDeleteResponse(response.id)}
                      disabled={isReadOnlyAdmin}
                    >
                      <Text style={styles.deleteResponseText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteModalButton, isReadOnlyAdmin && styles.disabledButton]}
              onPress={() => {
                handleDeletePrayer(selectedPrayer.id);
                setShowModal(false);
              }}
              disabled={isReadOnlyAdmin}
            >
              <Text style={styles.deleteModalText}>Delete Prayer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    );
  };

  if (loading && prayers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b2a20" />
        <Text style={styles.loadingText}>Loading prayers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prayer Management</Text>


      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <FlatList
        data={prayers}
        renderItem={renderPrayerItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          currentPage < totalPages ? (
            <ActivityIndicator size="small" color="#3b2a20" />
          ) : null
        }
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No prayers found.</Text>
        }
      />

      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  activeFilter: {
    backgroundColor: '#3b2a20',
  },
  filterText: {
    color: '#6b7280',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  prayerCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  prayerAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  prayerTags: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  tagYellow: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  tagGreen: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  tagBlue: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
  },
  prayerDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  prayerActions: {
    flexDirection: 'row',
  },
  viewButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7efe6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    marginTop: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
  },
  modalContent: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#1f2937',
  },
  contentText: {
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },
  responseItem: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  responseText: {
    fontSize: 14,
    color: '#1f2937',
  },
  responseDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  deleteResponseButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  deleteResponseText: {
    color: '#ffffff',
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  closeModalButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  closeModalText: {
    color: '#ffffff',
  },
  approveButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  approveText: {
    color: '#ffffff',
  },
  rejectButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  rejectText: {
    color: '#ffffff',
  },
  deleteModalButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteModalText: {
    color: '#ffffff',
  },
});