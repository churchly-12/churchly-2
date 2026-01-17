import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { API } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const login = async () => {
    setError('');
    try {
      const res = await API.post('/auth/login', {
        email: email,
        password: password,
      });

      Alert.alert('Success', 'Logged in!');
      navigation.replace('Home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#f7efe6] px-8">
      <View className="bg-white rounded-xl w-full max-w-sm p-8 shadow-lg">
        <View className="items-center mb-8">
          <Image source={require('../assets/church.png')} className="w-24 h-24 mb-4" />
          <Text className="text-2xl font-bold text-[#3b2a20]">Welcome Back</Text>
        </View>

        <TextInput
          className="w-full mb-4 p-4 border border-gray-300 rounded-xl bg-white text-[#3b2a20]"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <View className="relative mb-6">
          <TextInput
            className="w-full p-4 border border-gray-300 rounded-xl bg-white text-[#3b2a20]"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            className="absolute right-4 top-4"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text className="text-[#6b4a2d]">{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text className="text-red-600 mb-4 text-center">{error}</Text> : null}

        <TouchableOpacity
          className="w-full bg-[#6b4a2d] py-4 rounded-xl mb-4"
          onPress={login}
        >
          <Text className="text-white text-center font-semibold">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full py-4"
          onPress={() => navigation.navigate('Register')}
        >
          <Text className="text-blue-600 text-center">Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}