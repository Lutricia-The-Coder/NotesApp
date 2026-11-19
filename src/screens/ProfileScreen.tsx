import React, { useState } from 'react';

import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import {
  BackHeader,
  BottomNavigation,
  LockMark,
} from '../components/NotesUi';

type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;

export default function ProfileScreen({
  navigation,
}: ProfileScreenProps) {
  const { user, updateProfile, logout } = useAuth();

  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  const { colors, blueTheme, setBlueTheme } = useAppTheme();
  const firstName = user?.username.trim().split(/\s+/)[0] || 'there';
  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text,
    },
  ];

  const cancelEditing = () => {
    setUsername(user?.username ?? '');
    setEmail(user?.email ?? '');
    setCurrentPassword('');
    setNewPassword('');
    setEditingProfile(false);
  };

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
      await updateProfile(username, email, currentPassword, newPassword);

      setUsername(username.trim());
      setEmail(email.trim().toLowerCase());
      setCurrentPassword('');
      setNewPassword('');
      setEditingProfile(false);
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
    Alert.alert('Logout', 'Are you sure you want to log out?', [
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
    ]);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />

      {editingProfile ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.editContent}
          keyboardShouldPersistTaps="handled"
        >
          <BackHeader
            title="Account settings"
            onBack={cancelEditing}
          />

          <Text style={[styles.editDescription, { color: colors.muted }]}>
            Keep your details up to date.
          </Text>

          <Text style={[styles.fieldLabel, { color: colors.label }]}>
            Username
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="Enter your username"
            placeholderTextColor={colors.muted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
            accessibilityLabel="Username"
          />

          <Text style={[styles.fieldLabel, { color: colors.label }]}>
            Email address
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="Enter your email"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="Email address"
          />

          <Text style={[styles.fieldLabel, { color: colors.label }]}>
            New password
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="Leave blank to keep it"
            placeholderTextColor={colors.muted}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            accessibilityLabel="New password"
          />
          <Text style={[styles.helperText, { color: colors.muted }]}>
            At least 6 characters. Leave blank to keep it.
          </Text>

          <Text style={[styles.fieldLabel, styles.currentPasswordLabel, { color: colors.label }]}>
            Current password
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="Enter your current password"
            placeholderTextColor={colors.muted}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            accessibilityLabel="Current password"
          />
          <Text style={[styles.helperText, styles.currentPasswordHelper, { color: colors.muted }]}>
            Confirm it&apos;s you to save these changes.
          </Text>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.primary },
              saving && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={saving}
            accessibilityRole="button"
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save changes'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.profileContent}
            showsVerticalScrollIndicator={false}
          >
            <BackHeader
              title="My profile"
              onBack={() => navigation.goBack()}
            />


            <View
              style={[
                styles.accountCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.cardEyebrow, { color: colors.primary }]}>
                YOUR ACCOUNT
              </Text>
              <Text style={[styles.accountName, { color: colors.text }]}>
                {user?.username || 'Your account'}
              </Text>
              <Text style={[styles.accountEmail, { color: colors.muted }]}>
                {user?.email || ''}
              </Text>
              <TouchableOpacity
                style={[
                  styles.editAccountButton,
                  { backgroundColor: colors.soft },
                ]}
                onPress={() => setEditingProfile(true)}
                accessibilityRole="button"
              >
                <Text
                  style={[styles.editAccountText, { color: colors.softText }]}
                >
                  Edit account details
                </Text>
                <Text
                  style={[styles.forwardArrow, { color: colors.softText }]}
                  accessible={false}
                >
                  ›
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.themeCard,
                { backgroundColor: colors.soft },
              ]}
            >
              <View style={styles.themeCopy}>
                <Text style={[styles.themeTitle, { color: colors.text }]}>
                  Blue theme
                </Text>
                <Text style={[styles.themeDescription, { color: colors.muted }]}>
                  Switch to a calm blue palette.
                </Text>
              </View>
              <Switch
                value={blueTheme}
                onValueChange={setBlueTheme}
                trackColor={{ false: '#D8CDD1', true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#D8CDD1"
                accessibilityLabel="Blue theme"
                accessibilityHint="Changes the profile colors to blue"
              />
            </View>

            <View
              style={[
                styles.privacyCard,
                { backgroundColor: colors.soft },
              ]}
            >
              <LockMark color={colors.primary} />
              <View style={styles.privacyCopy}>
                <Text style={[styles.privacyTitle, { color: colors.text }]}>
                  Just for you
                </Text>
                <Text style={[styles.privacyText, { color: colors.muted }]}>
                  Your notes stay in your account. Sign out when you&apos;re done
                  on a shared device.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleLogout}
              accessibilityRole="button"
            >
              <Text style={[styles.logoutText, { color: colors.primary }]}>
                Log out
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <BottomNavigation
            active="profile"
            onNotes={() => navigation.navigate('Home')}
            onAdd={() => navigation.navigate('AddNote')}
            onProfile={() => navigation.navigate('Profile')}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  profileContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 22,
  },
  editContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 36,
  },
  greetingCaption: {
    fontSize: 14,
    marginBottom: 28,
  },
  greeting: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 33,
    lineHeight: 42,
    marginBottom: 8,
  },
  greetingDescription: {
    fontSize: 14,
    marginBottom: 28,
  },
  accountCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  cardEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 18,
  },
  accountName: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 24,
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 14,
    marginBottom: 20,
  },
  editAccountButton: {
    minHeight: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  editAccountText: {
    fontSize: 13,
    fontWeight: '700',
  },
  forwardArrow: {
    fontSize: 26,
    lineHeight: 28,
    marginTop: -2,
  },
  themeCard: {
    minHeight: 72,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeCopy: {
    flex: 1,
    paddingRight: 12,
  },
  themeTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  themeDescription: {
    fontSize: 12,
    lineHeight: 17,
  },
  privacyCard: {
    minHeight: 112,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  privacyCopy: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 18,
  },
  logoutButton: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
  },
  editDescription: {
    fontSize: 14,
    marginBottom: 28,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 9,
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 24,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: -15,
  },
  currentPasswordLabel: {
    marginTop: 28,
  },
  currentPasswordHelper: {
    marginTop: -15,
  },
  saveButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
