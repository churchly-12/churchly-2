import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function VerifyEmailScreen({ route, navigation }) {
  const { email: initialEmail } = route.params || {};
  const [email, setEmail] = useState(initialEmail || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { verifyEmail, resendVerificationCode } = useAuth();

  const handleVerify = async () => {
    setError('');
    if (!verificationCode.trim()) {
      setError('Verification code is required');
      return;
    }

    setLoading(true);
    const result = await verifyEmail({ email, code: verificationCode });
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Verification failed');
    } else {
      navigation.navigate('Login');
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);
    const result = await resendVerificationCode(email);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to resend code');
    }
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
          source={require('../../../assets/churchly-logo.png')}
          style={{ width: 100, height: 100, marginBottom: 20 }}
          resizeMode="contain"
        />

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3b2a20', marginBottom: 20, textAlign: 'center' }}>
          Verify Your Email
        </Text>

        {/* Email */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
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

        {/* Verification Code */}
        <TextInput
          placeholder="Verification Code"
          value={verificationCode}
          onChangeText={setVerificationCode}
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

        {/* Error */}
        {error ? <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>{error}</Text> : null}

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          style={{
            width: '100%',
            padding: 15,
            backgroundColor: '#6b4a2d',
            borderRadius: 15,
            marginBottom: 10,
            alignItems: 'center',
          }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Verify</Text>}
        </TouchableOpacity>

        {/* Resend Button */}
        <TouchableOpacity
          onPress={handleResend}
          disabled={loading}
          style={{ width: '100%', padding: 15, marginBottom: 10, alignItems: 'center' }}
        >
          <Text style={{ color: 'blue', textAlign: 'center' }}>Resend Verification Code</Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
          <Text style={{ color: '#6b4a2d', fontWeight: 'bold', textAlign: 'center' }}>Back to Login</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
