import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import AdminTopBar from '../../components/AdminTopBar';

export default function AdminLanding({ navigation }) {
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    active_users: 0,
    total_prayers: 0,
    recent_prayers: 0,
    total_parishes: 0,
    pending_prayers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get("/admin/dashboard");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const adminOptions = [
    {
      title: "User Management",
      description: "Manage user accounts, permissions, and access",
      icon: "people",
      screen: "Users",
      color: "#3b82f6"
    },
    {
      title: "Role Management",
      description: "Configure roles and permissions",
      icon: "shield-checkmark",
      screen: "Roles",
      color: "#10b981"
    },
    {
      title: "Youth Groups",
      description: "Manage youth groups, events, and announcements",
      icon: "person",
      screen: "Youth",
      color: "#f59e0b"
    },
    {
      title: "Prayer Management",
      description: "Moderate and manage prayer requests",
      icon: "chatbubble",
      screen: "Prayers",
      color: "#8b5cf6"
    }
  ];

  const handleOptionPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <AdminTopBar />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Admin Portal</Text>
          <Text style={styles.subtitle}>Choose an area to manage</Text>
        </View>

      {/* Admin Options Grid */}
      <View style={styles.optionsGrid}>
        {adminOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionCard, { borderColor: option.color }]}
            onPress={() => handleOptionPress(option.screen)}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${option.color}20` }]}>
              <Ionicons name={option.icon} size={24} color={option.color} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* System Overview */}
      <View style={styles.overview}>
        <Text style={styles.overviewTitle}>System Overview</Text>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#3b2a20" />
            <Text style={styles.loadingText}>Loading dashboard data...</Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{dashboardData.total_users}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{dashboardData.total_parishes}</Text>
              <Text style={styles.statLabel}>Total Parishes</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{dashboardData.pending_prayers}</Text>
              <Text style={styles.statLabel}>Pending Prayers</Text>
            </View>
          </View>
        )}
      </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // slate-50
  },
  topBar: {
    backgroundColor: '#1e293b', // slate-800
    paddingBottom: 10,
  },
  topBarContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
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
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a', // slate-900
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569', // slate-600
  },
  optionsGrid: {
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0', // slate-200
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 6,
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a', // slate-900
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: '#475569', // slate-600
    lineHeight: 16,
  },
  overview: {
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
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a', // slate-900
    marginBottom: 16,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#475569', // slate-600
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a', // slate-900
  },
  statLabel: {
    fontSize: 12,
    color: '#475569', // slate-600
    marginTop: 2,
  },
});