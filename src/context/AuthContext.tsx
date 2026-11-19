
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

// Authentication functions available throughout the app
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

    // Check whether the email already exists
    const existingUser = users.find(
      (item) => item.email === cleanEmail
    );

    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    // Hash the password before saving it
    const passwordHash = await hash(password, 10);

    const newUser: User = {
      id: Date.now().toString(),
      username: username.trim(),
      email: cleanEmail,
      passwordHash,
    };

    // Save the new user
    const updatedUsers = [...users, newUser];

    await saveUsers(updatedUsers);

    // Create the logged-in user information
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

    // Compare the entered password with the saved hash
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
