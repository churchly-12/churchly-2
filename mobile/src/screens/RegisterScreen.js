import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { API } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    try {
      await API.post('/auth/register', { email, password });
      Alert.alert('Success', 'Account created');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Create Account" onPress={register} />
    </View>
  );
}
