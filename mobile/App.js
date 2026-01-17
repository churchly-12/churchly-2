import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext.js';
import AppNavigator from './src/navigation/AppNavigator.js';
import { useFonts } from 'expo-font';

export default function App() {
  console.log('App component rendering');
  const [fontsLoaded] = useFonts({
    'rosary': require('./assets/fonts/rosary.ttf'),
  });

  if (!fontsLoaded) {
    console.log('Fonts not loaded, showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7efe6' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('Fonts loaded, rendering AuthProvider');
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
