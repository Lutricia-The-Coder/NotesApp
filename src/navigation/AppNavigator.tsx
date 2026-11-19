
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import WorkNotesScreen from '../screens/WorkNotesScreen';
import StudyNotesScreen from '../screens/StudyNotesScreen';
import PersonalNotesScreen from '../screens/PersonalNotesScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import EditNoteScreen from '../screens/EditNoteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NoteDetailsScreen from '../screens/NoteDetailsScreen';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
 const { user, loading } = useAuth();
if (loading) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" color="#333333" />
    </View>
  );
}
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'My Notes' }}
            />

            <Stack.Screen
              name="Work"
              component={WorkNotesScreen}
              options={{ title: 'Work Notes' }}
            />

            <Stack.Screen
              name="Study"
              component={StudyNotesScreen}
              options={{ title: 'Study Notes' }}
            />

            <Stack.Screen
              name="Personal"
              component={PersonalNotesScreen}
              options={{ title: 'Personal Notes' }}
            />

            <Stack.Screen
              name="AddNote"
              component={AddNoteScreen}
              options={{ title: 'Add Note' }}
            />

            <Stack.Screen
              name="EditNote"
              component={EditNoteScreen}
              options={{ title: 'Edit Note' }}
            />

            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'My Profile' }}
            />
            <Stack.Screen
  name="NoteDetails"
  component={NoteDetailsScreen}
  options={{ title: 'Note Details' }}
/>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: 'Create Account' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
