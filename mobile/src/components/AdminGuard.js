import React from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import SplashScreen from './SplashScreen';

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  if (loading) return <SplashScreen />;

  if (user?.role !== 'admin') {
    Alert.alert('Access Denied', 'You are not authorized to view this page.');
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs', params: { isAdmin: false } }],
    });
    return null;
  }

  return children;
}