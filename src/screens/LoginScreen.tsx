import React, { useState } from 'react';
import { Alert,  ScrollView,StatusBar,StyleSheet,Text, TextInput, TouchableOpacity,View,} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { BrandMark, LockMark } from '../components/NotesUi';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({
  navigation,
}: LoginScreenProps) {
  const { login } = useAuth();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    try {
      await login(email, password);
      Alert.alert('Success', 'You have logged in successfully!');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';
      Alert.alert('Login Failed', message);
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
          Your thoughts,{'\n'}safe &amp; sound.
        </Text>
        <Text style={[styles.description, { color: colors.muted }]}>
          Welcome back. Make a little room for you.
        </Text>

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
          placeholder="Enter your password"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Password"
          autoComplete="current-password"
          textContentType="password"
        />
<TouchableOpacity
  style={styles.forgotPasswordButton}
  onPress={() => navigation.navigate('ForgotPassword')}
  accessibilityRole="button"
>
  <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
    Forgot Password?
  </Text>
</TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Register')}
          accessibilityRole="button"
        >
          <Text style={[styles.link, { color: colors.softText }]}>
            Don&apos;t have an account? Register
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
    marginBottom: 34,
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
    marginBottom: 24,
  },
  button: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
  forgotPasswordButton: {
  alignSelf: 'flex-end',
  marginTop: -14,
  marginBottom: 20,
},

forgotPasswordText: {
  fontSize: 13,
  fontWeight: '600',
},
});
