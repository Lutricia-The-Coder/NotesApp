
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!username.trim() || !email.trim() || !currentPassword) {
      Alert.alert(
        'Missing Information',
        'Please enter your username, email and current password.'
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (newPassword.length > 0 && newPassword.length < 6) {
      Alert.alert(
        'Invalid Password',
        'Your new password must contain at least 6 characters.'
      );
      return;
    }

    try {
      setSaving(true);

      await updateProfile(
        username,
        email,
        currentPassword,
        newPassword
      );

      setCurrentPassword('');
      setNewPassword('');

      Alert.alert('Success', 'Your profile has been updated.');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to update your profile.';

      Alert.alert('Update Failed', message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch {
              Alert.alert('Error', 'Unable to log out.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>My Profile</Text>

      <Text style={styles.description}>
        Manage your account information.
      </Text>

      <Text style={styles.label}>Username</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Email Address</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.sectionHeading}>Change Password</Text>

      <Text style={styles.label}>Current Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your current password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      <Text style={styles.label}>New Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Leave empty to keep current password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[
          styles.saveButton,
          saving && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: '#777777',
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 18,
  },

  sectionHeading: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 10,
    marginBottom: 18,
  },

  saveButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  logoutButton: {
    backgroundColor: '#D93025',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },

  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
