
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';

import { useAuth } from '../context/AuthContext';

import {
  Note,
  getUserNotes,
} from '../storage/storage';

type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen({
  navigation,
}: HomeScreenProps) {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');

  // Load the user's notes
  const loadNotes = async () => {
    if (user) {
      const savedNotes = await getUserNotes(user.id);
      setNotes(savedNotes);
    }
  };

  // Load notes when the screen is opened
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);

    loadNotes();

    return unsubscribe;
  }, [navigation, user]);

  // Search notes using every word entered
  const filteredNotes = notes.filter((note) => {
    const searchWords = searchText
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const noteText = `${note.title} ${note.content}`
      .toLowerCase();

    return searchWords.every((word) =>
      noteText.includes(word)
    );
  });

  // Display each note
  const renderNote = ({ item }: { item: Note }) => {
    return (
      <TouchableOpacity
        style={styles.noteCard}
        onPress={() =>
          navigation.navigate('NoteDetails', {
            noteId: item.id,
          })
        }
      >
        <Text style={styles.noteTitle}>
          {item.title || 'Untitled Note'}
        </Text>

        <Text style={styles.noteContent} numberOfLines={2}>
          {item.content}
        </Text>

        <Text style={styles.noteCategory}>
          {item.category}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.username}>
            {user?.username}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButton}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.heading}>My Notes</Text>

      <Text style={styles.description}>
        Your notes, all in one place.
      </Text>

      <View style={styles.categories}>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => navigation.navigate('Work')}
        >
          <Text style={styles.categoryText}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => navigation.navigate('Study')}
        >
          <Text style={styles.categoryText}>Study</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => navigation.navigate('Personal')}
        >
          <Text style={styles.categoryText}>Personal</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.notesHeader}>
        <Text style={styles.sectionTitle}>All Notes</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddNote')}
        >
          <Text style={styles.addButtonText}>+ Add Note</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search notes..."
        value={searchText}
        onChangeText={setSearchText}
        autoCapitalize="none"
      />

      {/* Notes List */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText.trim()
              ? 'No notes match your search.'
              : 'No notes available. Add your first note!'}
          </Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  welcome: {
    fontSize: 16,
    color: '#777777',
  },

  username: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  profileButton: {
    color: '#333333',
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  description: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
    marginBottom: 20,
  },

  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  categoryButton: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  categoryText: {
    fontWeight: 'bold',
  },

  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  addButton: {
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 8,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 15,
  },

  noteCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  noteTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  noteContent: {
    fontSize: 14,
    color: '#555555',
  },

  noteCategory: {
    fontSize: 12,
    color: '#777777',
    marginTop: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 30,
  },
});
