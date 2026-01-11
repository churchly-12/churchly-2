import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogout({ navigation }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('AdminLogin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Logout</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="log-out-outline" size={40} color="#6b7280" />
        <Text style={styles.confirmationText}>
          Are you sure you want to logout from the admin portal?
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // gray-50
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a', // slate-900
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0', // slate-200
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmationText: {
    fontSize: 16,
    color: '#374151', // gray-700
    textAlign: 'center',
    marginTop: 12,
  },
  logoutButton: {
    backgroundColor: '#1e293b', // slate-800
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});