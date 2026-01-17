import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import AdminTopBar from '../../components/AdminTopBar';

export default function AdminSettings({ navigation }) {
  const { user } = useAuth();
  const [settingsForm, setSettingsForm] = useState({
    notifications: user?.notifications_enabled || true,
    theme: user?.theme || 'system',
    language: user?.language || 'en'
  });

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const handleSettingsChange = (name, value) => {
    setSettingsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileChange = (name, value) => {
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (name, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsSubmit = () => {
    // TODO: Implement admin settings update logic
    console.log('Admin settings updated:', settingsForm);
    Alert.alert('Success', 'Admin settings updated successfully!');
  };

  const handleProfileSubmit = () => {
    // TODO: Implement profile update logic
    console.log('Profile updated:', profileForm);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    // TODO: Implement password change logic
    console.log('Password changed');
    Alert.alert('Success', 'Password changed successfully!');
    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
  };

  const handleLogout = () => {
    navigation.navigate('Logout');
  };

  return (
    <View style={styles.container}>
      <AdminTopBar />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
        <Text style={styles.title}>Admin Settings</Text>
        <Text style={styles.subtitle}>Configure your admin portal preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Enable admin notifications</Text>
          <Switch
            value={settingsForm.notifications}
            onValueChange={(value) => handleSettingsChange('notifications', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Settings</Text>
        <Text style={styles.label}>Portal Theme</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={settingsForm.theme}
            onValueChange={(value) => handleSettingsChange('theme', value)}
            style={styles.picker}
          >
            <Picker.Item label="System Default" value="system" />
            <Picker.Item label="Light" value="light" />
            <Picker.Item label="Dark" value="dark" />
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language Settings</Text>
        <Text style={styles.label}>Portal Language</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={settingsForm.language}
            onValueChange={(value) => handleSettingsChange('language', value)}
            style={styles.picker}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Español" value="es" />
            <Picker.Item label="Français" value="fr" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSettingsSubmit}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Management</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={profileForm.full_name}
          onChangeText={(value) => handleProfileChange('full_name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={profileForm.email}
          onChangeText={(value) => handleProfileChange('email', value)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={profileForm.phone}
          onChangeText={(value) => handleProfileChange('phone', value)}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleProfileSubmit}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          value={passwordForm.current_password}
          onChangeText={(value) => handlePasswordChange('current_password', value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={passwordForm.new_password}
          onChangeText={(value) => handlePasswordChange('new_password', value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          value={passwordForm.confirm_password}
          onChangeText={(value) => handlePasswordChange('confirm_password', value)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handlePasswordSubmit}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Admin Name</Text>
          <Text style={styles.infoValue}>{user?.full_name || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Role</Text>
          <Text style={styles.infoValue}>{user?.role || 'Administrator'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Login</Text>
          <Text style={styles.infoValue}>{user?.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</Text>
        </View>
      </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: '#f9fafb',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b2a20',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
