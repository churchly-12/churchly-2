import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) return setError('Email is required');
    if (!password) return setError('Password is required');

    const result = await login({ email, password, isAdminLogin: false });
    if (!result.success) setError(result.error || 'Login failed');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f7efe6' }}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
      }}>

        {/* Logo */}
        <Image
          source={require('../../assets/churchly-logo.png')}
          style={{ width: 100, height: 100, marginBottom: 20 }}
          resizeMode="contain"
        />

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3b2a20', marginBottom: 20 }}>Welcome Back</Text>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            width: '100%',
            padding: 15,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 15,
            backgroundColor: '#fff',
            color: '#3b2a20',
          }}
        />

        {/* Password Input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 15, backgroundColor: '#fff', marginBottom: 15 }}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={{ flex: 1, padding: 15, color: '#3b2a20' }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingHorizontal: 15 }}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6b4a2d" />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{error}</Text> : null}

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={{ width: '100%', padding: 15, backgroundColor: '#6b4a2d', borderRadius: 15, marginBottom: 10 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Login</Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: 'blue', textAlign: 'center', marginTop: 10 }}>Don't have an account? Sign up</Text>
        </TouchableOpacity>

        {/* Admin Portal Link */}
        <TouchableOpacity onPress={() => navigation.navigate('AdminLogin')}>
          <Text style={{ color: '#6b4a2d', fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>Admin Portal</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
