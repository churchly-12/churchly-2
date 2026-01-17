import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import apiClient from '../../api/apiClient';

export default function VerifyEmailScreen({ navigation, route }) {
  const [otp, setOtp] = useState('');
  const email = route.params?.email || '';

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    try {
      await apiClient.post('/auth/verify-email', { otp });
      Alert.alert('Success', 'Email verified! You can now login.');
      navigation.navigate('Login');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Verification failed';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to{'\n'}{email}
      </Text>
      <TextInput
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
        placeholder="000000"
        keyboardType="numeric"
        maxLength={6}
        textAlign="center"
        autoFocus
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify Email</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Back to Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7efe6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b2a20',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 2,
    borderColor: '#3b2a20',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  button: {
    backgroundColor: '#3b2a20',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    color: '#3b2a20',
    textDecorationLine: 'underline',
  },
});