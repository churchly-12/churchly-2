import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();

  const handleSignup = async () => {
    setError('');

    if (!fullName.trim()) return setError('Full name is required');
    if (!password || password.length < 8) return setError('Password must be at least 8 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    const result = await signup({
      full_name: fullName,
      email,
      password,
      parish_id: null,
    });

    if (!result.success) setError(result.error || 'Signup failed');
    else navigation.navigate('VerifyEmail', { email });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f7efe6' }}>
      <View style={{ backgroundColor: 'white', borderRadius: 20, width: '100%', maxWidth: 400, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}>
        
        {/* Logo */}
        <Image
          source={require('../../../assets/churchly-logo.png')}
          style={{ width: 100, height: 100, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3b2a20', marginBottom: 20 }}>Create Account</Text>

        {/* Full Name */}
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          style={{ width: '100%', padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 15, backgroundColor: '#fff', color: '#3b2a20' }}
        />

        {/* Email */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ width: '100%', padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 15, backgroundColor: '#fff', color: '#3b2a20' }}
        />

        {/* Password */}
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

        {/* Confirm Password */}
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 15, backgroundColor: '#fff', marginBottom: 15 }}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={{ flex: 1, padding: 15, color: '#3b2a20' }}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ paddingHorizontal: 15 }}>
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#6b4a2d" />
          </TouchableOpacity>
        </View>

        {/* Error */}
        {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

        {/* Sign Up Button */}
        <TouchableOpacity onPress={handleSignup} style={{ width: '100%', padding: 15, backgroundColor: '#6b4a2d', borderRadius: 15, marginBottom: 10 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'blue', textAlign: 'center', marginTop: 10 }}>Already have an account? Login</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
