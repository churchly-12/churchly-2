import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';

export default function SettingsScreen({ navigation }) {
  const personalInfo = [
    { label: 'Full Name', value: 'John Christopher', icon: 'person' },
    { label: 'Email', value: 'john@example.com', icon: 'mail' },
    { label: 'Mobile Number', value: '+91 98765 43210', icon: 'call' },
    { label: 'Date of Birth', value: '15 Aug 1999', icon: 'calendar' },
    { label: 'Address', value: 'Chennai, India', icon: 'location' },
  ];

  const parishInfo = [
    { label: 'Family ID', value: 'FAM-1274', icon: 'card' },
    { label: 'Community / Zone', value: 'St. Joseph Community', icon: 'people' },
  ];

  const security = [
    { label: 'Change Password', icon: 'lock-closed' },
  ];

  const preferences = [
    { label: 'Notifications', value: 'Enabled', icon: 'notifications' },
  ];

  const support = [
    { label: 'Contact Support', icon: 'help-circle' },
    { label: 'Report a Problem', icon: 'warning' },
  ];

  const myPosts = [
    { label: 'My Prayer Requests', icon: 'heart' },
    { label: 'My Testimonials', icon: 'chatbubble' },
  ];

  const renderSettingItem = (item, index, onPress, isDestructive = false) => (
    <TouchableOpacity
      key={index}
      style={[styles.settingItem, isDestructive && styles.destructiveItem]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={20} color={isDestructive ? '#dc2626' : '#6b4a2d'} />
        </View>
        <View>
          <Text style={[styles.settingLabel, isDestructive && styles.destructiveText]}>
            {item.label}
          </Text>
          {item.value && (
            <Text style={styles.settingValue}>{item.value}</Text>
          )}
        </View>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isDestructive ? '#f87171' : '#9ca3af'} 
      />
    </TouchableOpacity>
  );

  const renderSection = (title, items, onItemPress) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map((item, index) => {
          const isDestructive = item.label === 'Delete My Account' || item.label === 'Logout';
          return renderSettingItem(item, index, () => onItemPress(item), isDestructive);
        })}
      </View>
    </View>
  );

  const handleItemPress = (item) => {
    const routes = {
      'Full Name': 'EditName',
      'Email': 'EditEmail',
      'Mobile Number': 'EditPhone',
      'Date of Birth': 'EditDOB',
      'Address': 'EditAddress',
      'Family ID': 'EditFamilyID',
      'Community / Zone': 'EditCommunity',
      'Change Password': 'ChangePassword',
      'Notifications': 'NotificationSettings',
      'Contact Support': 'ContactSupport',
      'Report a Problem': 'ReportProblem',
      'My Prayer Requests': 'MyPrayerRequests',
      'My Testimonials': 'MyTestimonials',
      'Delete My Account': 'DeleteAccount',
      'Logout': 'Logout',
    };
    
    if (routes[item.label]) {
      navigation.navigate(routes[item.label]);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.sectionContent}>
            {personalInfo.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.settingItem}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={20} color="#6b4a2d" />
                  </View>
                  <View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingValue}>{item.value}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Parish Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parish Information</Text>
          <View style={styles.sectionContent}>
            {parishInfo.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.settingItem}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={20} color="#6b4a2d" />
                  </View>
                  <View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingValue}>{item.value}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Security */}
        {renderSection('Security', security, handleItemPress)}

        {/* Preferences */}
        {renderSection('Preferences', preferences, handleItemPress)}

        {/* My Posts */}
        {renderSection('My Posts', myPosts, handleItemPress)}

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.sectionContent}>
            {support.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.settingItem}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={item.icon} size={20} color="#6b4a2d" />
                  </View>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Delete Account */}
        <TouchableOpacity
          style={styles.destructiveButton}
          onPress={() => handleItemPress({ label: 'Delete My Account' })}
        >
          <View style={styles.settingLeft}>
            <View style={styles.destructiveIconContainer}>
              <Ionicons name="trash" size={20} color="#dc2626" />
            </View>
            <Text style={styles.destructiveText}>Delete My Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#f87171" />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.destructiveButton}
          onPress={() => handleItemPress({ label: 'Logout' })}
        >
          <View style={styles.settingLeft}>
            <View style={styles.destructiveIconContainer}>
              <Ionicons name="log-out" size={20} color="#dc2626" />
            </View>
            <Text style={styles.destructiveText}>Logout</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#f87171" />
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b2a20',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b4a2d',
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f7efe6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3b2a20',
  },
  settingValue: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  destructiveButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  destructiveIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#dc2626',
  },
  bottomPadding: {
    height: 20,
  },
});
