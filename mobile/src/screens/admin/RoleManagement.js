import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

const availablePermissions = [
  'admin_access',
  'manage_users',
  'manage_roles',
  'manage_content',
  'manage_prayers',
  'create_prayer',
  'respond_prayer',
  'view_analytics'
];

const rolePresets = [
  { label: 'Select Preset', value: '' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
  { label: 'Moderator', value: 'MODERATOR' },
  { label: 'Parish Admin', value: 'PARISH_ADMIN' },
  { label: 'Read-Only Admin', value: 'READ_ONLY_ADMIN' },
];

export default function RoleManagement() {
  const { token, isReadOnlyAdmin } = useAuth();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showUserRoleModal, setShowUserRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRoles(response.data);
    } catch (err) {
      setError('Failed to fetch roles');
      console.error('Roles fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data.data);
    } catch (err) {
      console.error('Users fetch error:', err);
    }
  };

  const handleCreateRole = async (roleData) => {
    try {
      await apiClient.post('/admin/roles', roleData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchRoles();
      setShowRoleModal(false);
      setSelectedRole(null);
    } catch (err) {
      setError('Failed to create role');
      console.error('Role create error:', err);
    }
  };

  const handleUpdateRole = async (roleId, roleData) => {
    try {
      await apiClient.put(`/admin/roles/${roleId}`, roleData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchRoles();
      setShowRoleModal(false);
      setSelectedRole(null);
    } catch (err) {
      setError('Failed to update role');
      console.error('Role update error:', err);
    }
  };

  const handleDeleteRole = async (roleId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this role?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/admin/roles/${roleId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              fetchRoles();
            } catch (err) {
              setError('Failed to delete role');
              console.error('Role delete error:', err);
            }
          },
        },
      ]
    );
  };

  const handleAssignRole = async (userId, roleId) => {
    try {
      await apiClient.post(`/admin/users/${userId}/roles`, { role_id: roleId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (err) {
      Alert.alert('Error', 'Failed to assign role');
      console.error('Role assign error:', err);
    }
  };

  const handleRemoveRole = async (userId, roleId) => {
    try {
      await apiClient.delete(`/admin/users/${userId}/roles/${roleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (err) {
      Alert.alert('Error', 'Failed to remove role');
      console.error('Role remove error:', err);
    }
  };

  const openRoleModal = (role = null) => {
    setSelectedRole(role);
    setShowRoleModal(true);
  };

  const openUserRoleModal = () => {
    setShowUserRoleModal(true);
  };

  const RoleModal = () => {
    const [formData, setFormData] = useState({
      name: selectedRole?.name || '',
      preset_name: '',
      permissions: selectedRole?.permissions || []
    });

    const handleSubmit = () => {
      if (selectedRole) {
        handleUpdateRole(selectedRole.id, formData);
      } else {
        handleCreateRole(formData);
      }
    };

    const handlePermissionChange = (permission) => {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permission)
          ? prev.permissions.filter(p => p !== permission)
          : [...prev.permissions, permission]
      }));
    };

    const handlePresetChange = (preset) => {
      setFormData(prev => ({
        ...prev,
        preset_name: preset,
        permissions: preset ? [] : prev.permissions // Clear permissions if preset selected
      }));
    };

    return (
      <Modal visible={showRoleModal} animationType="slide" onRequestClose={() => setShowRoleModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedRole ? 'Edit Role' : 'Create Role'}
            </Text>
            <TouchableOpacity onPress={() => setShowRoleModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Role Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter role name"
            />

            <Text style={styles.label}>Preset (Optional)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.preset_name}
                onValueChange={handlePresetChange}
                style={styles.picker}
              >
                {rolePresets.map((preset) => (
                  <Picker.Item key={preset.value} label={preset.label} value={preset.value} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Permissions</Text>
            <View style={styles.permissionsContainer}>
              {availablePermissions.map((permission) => (
                <TouchableOpacity
                  key={permission}
                  style={styles.permissionItem}
                  onPress={() => handlePermissionChange(permission)}
                  disabled={!!formData.preset_name}
                >
                  <Ionicons
                    name={formData.permissions.includes(permission) ? "checkbox" : "square-outline"}
                    size={20}
                    color={formData.permissions.includes(permission) ? "#10b981" : "#6b7280"}
                  />
                  <Text style={styles.permissionText}>
                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveButton, isReadOnlyAdmin && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isReadOnlyAdmin}
            >
              <Text style={styles.saveText}>{selectedRole ? 'Update' : 'Create'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const UserRoleModal = () => {
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
      if (selectedUser) {
        fetchUserDetails();
      }
    }, [selectedUser]);

    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get(`/admin/users/${selectedUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserRoles(response.data.roles || []);
      } catch (err) {
        console.error('User details fetch error:', err);
      }
    };

    const handleUserChange = (userId) => {
      const user = users.find(u => u.id === userId);
      setSelectedUser(user);
    };

    const isRoleAssigned = (roleId) => {
      return userRoles.some(role => role.id === roleId);
    };

    const toggleRole = (role) => {
      if (isRoleAssigned(role.id)) {
        handleRemoveRole(selectedUser.id, role.id);
      } else {
        handleAssignRole(selectedUser.id, role.id);
      }
    };

    return (
      <Modal visible={showUserRoleModal} animationType="slide" onRequestClose={() => setShowUserRoleModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Manage User Roles</Text>
            <TouchableOpacity onPress={() => setShowUserRoleModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Select User</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedUser?.id || ''}
                onValueChange={handleUserChange}
                style={styles.picker}
              >
                <Picker.Item label="Select User" value="" />
                {users.map((user) => (
                  <Picker.Item key={user.id} label={`${user.full_name} (${user.email})`} value={user.id} />
                ))}
              </Picker>
            </View>

            {selectedUser && (
              <>
                <Text style={styles.label}>Roles for {selectedUser.full_name}</Text>
                <View style={styles.rolesList}>
                  {roles.map((role) => (
                    <TouchableOpacity
                      key={role.id}
                      style={styles.roleItem}
                      onPress={() => toggleRole(role)}
                      disabled={isReadOnlyAdmin}
                    >
                      <Ionicons
                        name={isRoleAssigned(role.id) ? "checkbox" : "square-outline"}
                        size={20}
                        color={isRoleAssigned(role.id) ? "#10b981" : "#6b7280"}
                      />
                      <Text style={styles.roleText}>{role.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderRoleCard = ({ item }) => (
    <View style={styles.roleCard}>
      <View style={styles.roleHeader}>
        <Text style={styles.roleName}>{item.name}</Text>
        <View style={styles.roleActions}>
          <TouchableOpacity
            onPress={() => openRoleModal(item)}
            disabled={isReadOnlyAdmin}
            style={styles.actionButton}
          >
            <Ionicons name="pencil" size={16} color={isReadOnlyAdmin ? "#d1d5db" : "#f59e0b"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteRole(item.id)}
            disabled={isReadOnlyAdmin}
            style={styles.actionButton}
          >
            <Ionicons name="trash" size={16} color={isReadOnlyAdmin ? "#d1d5db" : "#dc2626"} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.permissionsLabel}>Permissions:</Text>
      <View style={styles.permissionsList}>
        {item.permissions.map((permission) => (
          <View key={permission} style={styles.permissionBadge}>
            <Text style={styles.permissionBadgeText}>
              {permission.replace(/_/g, ' ')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading roles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Role Management</Text>
        <Text style={styles.subtitle}>Manage roles and user permissions</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.createButton, isReadOnlyAdmin && styles.disabledButton]}
            onPress={() => openRoleModal()}
            disabled={isReadOnlyAdmin}
          >
            <Ionicons name="add" size={16} color="white" />
            <Text style={styles.createText}>Create Role</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={openUserRoleModal}
          >
            <Ionicons name="people" size={16} color="white" />
            <Text style={styles.manageText}>Manage User Roles</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={roles}
        keyExtractor={(item) => item.id}
        renderItem={renderRoleCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {roles.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No roles found. Create your first role to get started.</Text>
        </View>
      )}

      <RoleModal />
      <UserRoleModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
    padding: 16,
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
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  createText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  manageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 16,
  },
  roleCard: {
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
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    flex: 1,
  },
  roleActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  permissionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  permissionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  permissionBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  permissionBadgeText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
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
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  picker: {
    height: 50,
  },
  permissionsContainer: {
    maxHeight: 200,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  permissionText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  rolesList: {
    marginTop: 8,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  roleText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
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
});