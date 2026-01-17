import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7efe6' }}>
      <ActivityIndicator size="large" color="#3b2a20" />
      <Text style={{ marginTop: 20, fontSize: 18, color: '#3b2a20' }}>Loading Churchly...</Text>
    </View>
  );
};

export default SplashScreen;