
import AsyncStorage from '@react-native-async-storage/async-storage';

// Information saved about each user
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

// Information about the logged-in user
export interface LoggedInUser {
  id: string;
  username: string;
  email: string;
}

// Storage keys
const USERS_KEY = '@notes_app_users';
const SESSION_KEY = '@notes_app_session';

// Get all registered users
export const getUsers = async (): Promise<User[]> => {
  const users = await AsyncStorage.getItem(USERS_KEY);

  return users ? JSON.parse(users) : [];
};

// Save registered users
export const saveUsers = async (users: User[]): Promise<void> => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Save the logged-in user's session
export const saveSession = async (
  user: LoggedInUser
): Promise<void> => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

// Get the current logged-in user
export const getSession = async (): Promise<LoggedInUser | null> => {
  const session = await AsyncStorage.getItem(SESSION_KEY);

  return session ? JSON.parse(session) : null;
};

// Remove the logged-in user's session
export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_KEY);
};
