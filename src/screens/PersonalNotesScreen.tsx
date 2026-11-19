
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';

import { useAuth } from '../context/AuthContext';

import {
  Note,
  getUserNotes,
} from '../storage/storage';

type PersonalNotesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Personal'
>;

type SortOrder = 'newest' | 'oldest';

export default function PersonalNotesScreen({
  navigation,
}: PersonalNotesScreenProps) {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const loadNotes = async () => {
    if (user) {
      const savedNotes = await getUserNotes(user.id);

      const personalNotes = savedNotes.filter(
        (note) => note.category === 'Personal'
      );

      setNotes(personalNotes);
    }
  };

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

    const noteText = `${note.title} ${note.content}`.toLowerCase();

    return searchWords.every((word) =>
      noteText.includes(word)
    );
  });

  // Sort notes by date added
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();

    if (sortOrder === 'newest') {
      return dateB - dateA;
    }

    return dateA - dateB;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personal Notes</Text>

      <Text style={styles.description}>
        All your personal notes.
      </Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search personal notes..."
        value={searchText}
        onChangeText={setSearchText}
        autoCapitalize="none"
      />

      {/* Sorting Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by date:</Text>

        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOrder === 'newest' && styles.activeSortButton,
          ]}
          onPress={() => setSortOrder('newest')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOrder === 'newest' && styles.activeSortButtonText,
            ]}
          >
            Newest First
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOrder === 'oldest' && styles.activeSortButton,
          ]}
          onPress={() => setSortOrder('oldest')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOrder === 'oldest' && styles.activeSortButtonText,
            ]}
          >
            Oldest First
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
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

            <Text style={styles.noteContent}>
              {item.content}
            </Text>

            <Text style={styles.date}>
              Added: {new Date(item.dateAdded).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText.trim()
              ? 'No personal notes match your search.'
              : 'No personal notes available.'}
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

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: '#777777',
    marginBottom: 20,
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },

  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 8,
  },

  sortLabel: {
    fontSize: 13,
    color: '#777777',
  },

  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },

  activeSortButton: {
    backgroundColor: '#333333',
  },

  sortButtonText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: 'bold',
  },

  activeSortButtonText: {
    color: '#FFFFFF',
  },

  noteCard: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  noteContent: {
    fontSize: 15,
    color: '#555555',
  },

  date: {
    fontSize: 12,
    color: '#888888',
    marginTop: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 30,
  },
});
