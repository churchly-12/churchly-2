import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';
import TopBar from '../../components/TopBar';

export default function NewTestimonialScreen({ navigation }) {
  const [story, setStory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!story.trim()) {
      Alert.alert('Error', 'Please fill the testimony');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post('/api/testimonies/post', {
        content: story.trim(),
        is_anonymous: isAnonymous,
      });
      if (response.data.success) {
        Alert.alert('Success', 'Testimony posted successfully!');
        navigation.navigate('Testimonials');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to post testimony');
      }
    } catch (err) {
      console.error('Post testimony error:', err);
      Alert.alert('Error', 'Failed to post testimony');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Share Testimony ✨</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Story Textarea */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Testimony</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={story}
              onChangeText={setStory}
              placeholder="Share what God has done in your life..."
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>

          {/* Anonymous Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsAnonymous(!isAnonymous)}
          >
            <View style={[styles.checkbox, isAnonymous && styles.checkboxChecked]}>
              {isAnonymous && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={styles.checkboxLabel}>Post anonymously</Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Posting...' : 'Post Testimony'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#6F4E37',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#1f2937',
  },
  textarea: {
    height: 160,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#eab308',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#eab308',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#eab308',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

