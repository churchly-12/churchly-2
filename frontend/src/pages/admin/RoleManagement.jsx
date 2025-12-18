import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

const RoleManagement = () => {
  const { token, isReadOnlyAdmin } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

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

  useEffect(() => {
    fetchRoles();
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
    if (window.confirm('Are you sure you want to delete this role?')) {
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
    }
  };

  const openRoleModal = (role = null) => {
    setSelectedRole(role);
    setShowRoleModal(true);
  };

  const RoleModal = () => {
    const [formData, setFormData] = useState({
      name: selectedRole?.name || '',
      permissions: selectedRole?.permissions || []
    });

    const handleSubmit = (e) => {
      e.preventDefault();
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

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {selectedRole ? 'Edit Role' : 'Create Role'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={formData.permissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      className="mr-2"
                    />
                    <label htmlFor={permission} className="text-sm text-gray-700">
                      {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isReadOnlyAdmin}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedRole ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3b2a20]">Role Management</h1>
        <button
          onClick={() => openRoleModal()}
          disabled={isReadOnlyAdmin}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          Create Role
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => openRoleModal(role)}
                  disabled={isReadOnlyAdmin}
                  className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  disabled={isReadOnlyAdmin}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Permissions:</h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {permission.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {roles.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No roles found. Create your first role to get started.</p>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && <RoleModal />}
    </div>
  );
};

export default RoleManagement;