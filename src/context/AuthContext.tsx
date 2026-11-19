
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react';

import { hash, compare } from 'bcryptjs';

import {
  User,
  LoggedInUser,
  getUsers,
  saveUsers,
  saveSession,
  getSession,
  clearSession,
} from '../storage/storage';

interface AuthContextType {
  user: LoggedInUser | null;
  loading: boolean;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    username: string,
    email: string,
    currentPassword: string,
    newPassword?: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check whether a user was already logged in
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await getSession();
        setUser(savedUser);
      } catch (error) {
        console.log('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const users = await getUsers();
    const cleanEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (item) => item.email === cleanEmail
    );

    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await hash(password, 10);

    const newUser: User = {
      id: Date.now().toString(),
      username: username.trim(),
      email: cleanEmail,
      passwordHash,
    };

    const updatedUsers = [...users, newUser];

    await saveUsers(updatedUsers);

    const loggedInUser: LoggedInUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    await saveSession(loggedInUser);
    setUser(loggedInUser);
  };

  // Login an existing user
  const login = async (email: string, password: string) => {
    const users = await getUsers();
    const cleanEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (item) => item.email === cleanEmail
    );

    if (!existingUser) {
      throw new Error('Invalid email or password.');
    }

    const passwordMatches = await compare(
      password,
      existingUser.passwordHash
    );

    if (!passwordMatches) {
      throw new Error('Invalid email or password.');
    }

    const loggedInUser: LoggedInUser = {
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
    };

    await saveSession(loggedInUser);
    setUser(loggedInUser);
  };

  // Update the current user's profile
  const updateProfile = async (
    username: string,
    email: string,
    currentPassword: string,
    newPassword?: string
  ) => {
    if (!user) {
      throw new Error('You must be logged in to update your profile.');
    }

    const users = await getUsers();

    const currentUser = users.find(
      (item) => item.id === user.id
    );

    if (!currentUser) {
      throw new Error('User account could not be found.');
    }

    // Verify the current password before making changes
    const passwordMatches = await compare(
      currentPassword,
      currentUser.passwordHash
    );

    if (!passwordMatches) {
      throw new Error('Your current password is incorrect.');
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check whether another account already uses this email
    const existingEmail = users.find(
      (item) =>
        item.email === cleanEmail &&
        item.id !== user.id
    );

    if (existingEmail) {
      throw new Error('This email address is already in use.');
    }

    // Hash the new password if one was provided
    const updatedPasswordHash =
      newPassword && newPassword.trim().length > 0
        ? await hash(newPassword, 10)
        : currentUser.passwordHash;

    const updatedUser: User = {
      ...currentUser,
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: updatedPasswordHash,
    };

    const updatedUsers = users.map((item) =>
      item.id === user.id ? updatedUser : item
    );

    await saveUsers(updatedUsers);

    const updatedSession: LoggedInUser = {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
    };

    await saveSession(updatedSession);
    setUser(updatedSession);
  };

  // Logout the current user
  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access authentication
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
