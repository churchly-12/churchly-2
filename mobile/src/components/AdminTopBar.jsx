import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AdminTopBar() {
  const navigation = useNavigation();
  const route = useRoute();

  // Check if we're on admin sub-pages (not main tabs)
  const isAdminSubPage = route.name !== 'AdminActivitiesMain' && route.name !== 'AdminLanding' && route.name !== 'UserManagement' && route.name !== 'AdminSettings';

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left side: Back arrow for admin sub-pages */}
        <View style={styles.left}>
          {isAdminSubPage && (
            <TouchableOpacity onPress={handleBack} style={styles.button}>
              <Ionicons name="arrow-back" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Center: Admin Portal Title */}
        <View style={styles.center}>
          <Text style={styles.title}>Churchly Admin</Text>
        </View>

        {/* Right side: Settings */}
        <View style={styles.right}>
          <TouchableOpacity onPress={handleSettings} style={styles.button}>
            <Ionicons name="settings-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334155',
    paddingTop: 24, // For status bar
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 16,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  button: {
    padding: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});