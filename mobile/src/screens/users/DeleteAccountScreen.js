import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';

export default function DeleteAccountScreen({ navigation }) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is permanent.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In production, call API to delete account
            Alert.alert('Success', 'Your account has been deleted.', [
              { text: 'OK', onPress: () => navigation.replace('Login') }
            ]);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TopBar />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#dc2626" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#dc2626' }]}>Delete Account</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.warningCard}>
          <View style={styles.warningRow}>
            <Ionicons name="alert-triangle" size={24} color="#dc2626" />
            <Text style={styles.warningText}>This action is permanent.</Text>
          </View>
          <Text style={styles.description}>
            All your data will be removed. Are you sure you want to continue?
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Yes, Delete My Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3b2a20',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  warningCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

