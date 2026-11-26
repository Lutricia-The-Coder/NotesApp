import React, { useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { BrandMark, LockMark } from '../components/NotesUi';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

export default function RegisterScreen({
  navigation,
}: RegisterScreenProps) {
  const { register } = useAuth();
  const { colors } = useAppTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
  Alert.alert('Error', 'Please enter a valid email address.');
  return;
}

    try {
      await register(username, email, password);
      Alert.alert('Success', 'Your account has been created!');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';
      Alert.alert('Registration Failed', message);
    }
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandRow}>
          <BrandMark />
          <View style={[styles.lockTile, { backgroundColor: colors.soft }]}>
            <LockMark color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>
          A fresh start{'\n'}for your thoughts.
        </Text>
        <Text style={[styles.description, { color: colors.muted }]}>
          Gather your ideas in a space of your own.
        </Text>

        <Text style={[styles.label, { color: colors.label }]}>Username</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Enter your username"
          placeholderTextColor={colors.muted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="words"
          accessibilityLabel="Username"
        />

        <Text style={[styles.label, { color: colors.label }]}>
          Email address
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Enter your email"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Email address"
          autoComplete="email"
textContentType="emailAddress"
        />

        <Text style={[styles.label, { color: colors.label }]}>Password</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Create a password"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Password"
          autoComplete="new-password"
textContentType="newPassword"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleRegister}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
        >
          <Text style={[styles.link, { color: colors.softText }]}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },
  brandRow: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  lockTile: {
    width: 82,
    height: 82,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: 'serif',
    fontSize: 34,
    lineHeight: 44,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 9,
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 15,
    fontSize: 15,
    marginBottom: 21,
  },
  button: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
  },
});
