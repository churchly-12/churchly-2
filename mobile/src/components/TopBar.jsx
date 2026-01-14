import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function TopBar() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  // Check if we're on main pages that don't need back button
  const isMainPage = route.name === 'Home' || route.name === 'DevotionsMain' || route.name === 'ActivitiesMain' || route.name === 'CommunityMain';

  // Check if we're on a settings-related page
  const isSettingsPage = route.name === 'Settings' || route.name === 'ChangePassword' || route.name === 'NotificationSettings' || route.name === 'ContactSupport' || route.name === 'ReportProblem' || route.name === 'MyPrayerRequests' || route.name === 'MyTestimonials' || route.name === 'DeleteAccount' || route.name === 'Logout';

  const handleSettingsPress = () => {
    // Navigate to Settings in the Home tab from any tab
    navigation.navigate('Home', { screen: 'Settings' });
  };

  const handleProfilePress = () => {
    // Navigate to profile - we'll need to create this screen
    // navigation.navigate('Profile');
    console.log("Profile pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left side: Back button or empty spacer */}
        {isMainPage ? (
          <View style={styles.spacer} />
        ) : (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}

        {/* Center: Logo */}
        <Text style={styles.logo}>Churchly</Text>

        {/* Right side: Settings only */}
        <View style={styles.rightIcons}>
          {!isSettingsPage && (
            <TouchableOpacity
              onPress={handleSettingsPress}
              style={styles.iconButton}
            >
              <Ionicons name="settings" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6F4E37',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  spacer: {
    width: 40,
    height: 40,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
