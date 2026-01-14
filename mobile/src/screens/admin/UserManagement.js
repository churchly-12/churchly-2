import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  Switch,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import apiClient, { API_BASE_URL } from '../../api/apiClient';
import AdminTopBar from '../../components/AdminTopBar';

export default function UserManagement({ navigation }) {
  const [users, setUsers] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedParish, setSelectedParish] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchParishes();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [search, selectedParish, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (selectedParish) params.parish_id = selectedParish;
      const res = await apiClient.get('/admin/users', { params });
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchParishes = async () => {
    try {
      const res = await apiClient.get('/admin/parishes');
      setParishes(res.data);
    } catch (error) {
      console.error('Failed to fetch parishes');
    }
  };

  const handleDelete = async (userId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/admin/users/${userId}`);
              fetchUsers();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = async (user) => {
    try {
      const res = await apiClient.get(`/admin/users/${user.id}`);
      setSelectedUser(res.data);
      setEditMode(false);
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user details');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditData({
      full_name: user.full_name || '',
      email: user.email || '',
      is_active: user.is_active || false,
      is_verified: user.is_verified || false,
      parish_id: user.parish_id || '',
    });
    setEditMode(true);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await apiClient.put(`/admin/users/${selectedUser.id}`, editData);
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  const handleExport = () => {
    Linking.openURL(`${API_BASE_URL}/api/admin/export/users`);
  };

  const renderUserCard = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.full_name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, item.is_active ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={styles.statusText}>{item.is_active ? 'Active' : 'Inactive'}</Text>
          </View>
          <View style={[styles.statusBadge, item.is_verified ? styles.verifiedBadge : styles.unverifiedBadge]}>
            <Text style={styles.statusText}>{item.is_verified ? 'Verified' : 'Unverified'}</Text>
          </View>
        </View>
        <Text style={styles.createdAt}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleViewDetails(item)}
        >
          <Ionicons name="eye" size={16} color="#3b82f6" />
          <Text style={styles.viewText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="pencil" size={16} color="#f59e0b" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash" size={16} color="#dc2626" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalPages = Math.ceil(total / 10);

  return (
    <View style={styles.container}>
      <AdminTopBar />
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <Text style={styles.subtitle}>Manage user accounts and permissions</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Ionicons name="download" size={16} color="white" />
          <Text style={styles.exportText}>Export CSV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email"
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedParish}
            onValueChange={setSelectedParish}
            style={styles.picker}
          >
            <Picker.Item label="All Parishes" value="" />
            {parishes.map((parish) => (
              <Picker.Item key={parish.id} label={parish.name} value={parish.id} />
            ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUserCard}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageButton, page === 1 && styles.disabledButton]}
          onPress={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <Text style={styles.pageText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>
          Page {page} of {totalPages}
        </Text>
        <TouchableOpacity
          style={[styles.pageButton, page === totalPages && styles.disabledButton]}
          onPress={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          <Text style={styles.pageText}>Next</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editMode ? 'Edit User' : 'User Details'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {editMode ? (
              <View>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editData.full_name}
                  onChangeText={(text) => setEditData({ ...editData, full_name: text })}
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editData.email}
                  onChangeText={(text) => setEditData({ ...editData, email: text })}
                  keyboardType="email-address"
                />
                <Text style={styles.label}>Active</Text>
                <Switch
                  value={editData.is_active}
                  onValueChange={(value) => setEditData({ ...editData, is_active: value })}
                />
                <Text style={styles.label}>Verified</Text>
                <Switch
                  value={editData.is_verified}
                  onValueChange={(value) => setEditData({ ...editData, is_verified: value })}
                />
                <Text style={styles.label}>Parish</Text>
                <Picker
                  selectedValue={editData.parish_id}
                  onValueChange={(value) => setEditData({ ...editData, parish_id: value })}
                >
                  <Picker.Item label="Select Parish" value="" />
                  {parishes.map((parish) => (
                    <Picker.Item key={parish.id} label={parish.name} value={parish.id} />
                  ))}
                </Picker>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                  <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              selectedUser && (
                <View>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedUser.full_name}</Text>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                  <Text style={styles.detailLabel}>Active:</Text>
                  <Text style={styles.detailValue}>{selectedUser.is_active ? 'Yes' : 'No'}</Text>
                  <Text style={styles.detailLabel}>Verified:</Text>
                  <Text style={styles.detailValue}>{selectedUser.is_verified ? 'Yes' : 'No'}</Text>
                  <Text style={styles.detailLabel}>Parish:</Text>
                  <Text style={styles.detailValue}>
                    {parishes.find(p => p.id === selectedUser.parish_id)?.name || 'N/A'}
                  </Text>
                  <Text style={styles.detailLabel}>Created:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedUser.created_at).toLocaleString()}
                  </Text>
                  {selectedUser.roles && selectedUser.roles.length > 0 && (
                    <>
                      <Text style={styles.detailLabel}>Roles:</Text>
                      {selectedUser.roles.map((role) => (
                        <Text key={role.id} style={styles.detailValue}>
                          {role.name}
                        </Text>
                      ))}
                    </>
                  )}
                </View>
              )
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  exportText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  filters: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  picker: {
    height: 50,
  },
  listContainer: {
    paddingBottom: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  inactiveBadge: {
    backgroundColor: '#fef2f2',
  },
  verifiedBadge: {
    backgroundColor: '#dbeafe',
  },
  unverifiedBadge: {
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  createdAt: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
  },
  viewText: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 4,
  },
  editText: {
    fontSize: 12,
    color: '#f59e0b',
    marginTop: 4,
  },
  deleteText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  pageButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  pageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pageInfo: {
    fontSize: 14,
    color: '#374151',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#6b7280',
  },
});