import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';

export default function ReportProblemScreen({ navigation }) {
  const [problem, setProblem] = useState('');

  const handleSend = () => {
    if (problem.trim().length === 0) {
      Alert.alert('Error', 'Please describe the problem!');
      return;
    }
    // In production, call API here
    Alert.alert('Success', 'Your problem report has been submitted!', [
      { text: 'OK', onPress: () => {
        setProblem('');
        navigation.goBack();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <TopBar />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#3b2a20" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report a Problem</Text>
      </View>

      <View style={styles.content}>
        <TextInput
          style={styles.textArea}
          placeholder="Explain the issue you're facing..."
          placeholderTextColor="#9ca3af"
          value={problem}
          onChangeText={setProblem}
          multiline
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSend}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7efe6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3b2a20',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  textArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 200,
  },
  submitButton: {
    backgroundColor: '#6b4a2d',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

