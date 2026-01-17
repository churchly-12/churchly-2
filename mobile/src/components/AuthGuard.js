import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import SplashScreen from './SplashScreen';

export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigation = useNavigation();

  // While restoring auth state
  if (loading) {
    return <SplashScreen />;
  }

  // If not authenticated, redirect to Login
  if (!isAuthenticated) {
    navigation.replace('Login');
    return null;
  }

  // Authenticated, show protected content
  return children;
}