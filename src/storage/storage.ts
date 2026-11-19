
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

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'Work' | 'Study' | 'Personal';
  dateAdded: string;
  dateEdited?: string;
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

const NOTES_KEY = '@notes_app_notes';

// Get all saved notes
export const getNotes = async (): Promise<Note[]> => {
  const notes = await AsyncStorage.getItem(NOTES_KEY);

  return notes ? JSON.parse(notes) : [];
};

// Save all notes
export const saveNotes = async (notes: Note[]): Promise<void> => {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

// Get notes belonging to a specific user
export const getUserNotes = async (
  userId: string
): Promise<Note[]> => {
  const notes = await getNotes();

  return notes.filter((note) => note.userId === userId);
};

// Add a new note
export const addNote = async (note: Note): Promise<void> => {
  const notes = await getNotes();

  const updatedNotes = [...notes, note];

  await saveNotes(updatedNotes);
};

export const updateNote = async (
  updatedNote: Note
): Promise<void> => {
  const notes = await getNotes();

  const updatedNotes = notes.map((note) =>
    note.id === updatedNote.id &&
    note.userId === updatedNote.userId
      ? updatedNote
      : note
  );

  await saveNotes(updatedNotes);
};
// delete note 
export const deleteNote = async (
  noteId: string,
  userId: string
): Promise<void> => {
  const notes = await getNotes();

  const updatedNotes = notes.filter(
    (note) =>
      !(note.id === noteId && note.userId === userId)
  );

  await saveNotes(updatedNotes);
};
