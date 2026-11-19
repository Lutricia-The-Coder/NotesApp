
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

type WorkNotesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Work'
>;

export default function WorkNotesScreen({
  navigation,
}: WorkNotesScreenProps) {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');

  const loadNotes = async () => {
    if (user) {
      const savedNotes = await getUserNotes(user.id);

      const workNotes = savedNotes.filter(
        (note) => note.category === 'Work'
      );

      setNotes(workNotes);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);

    loadNotes();

    return unsubscribe;
  }, [navigation, user]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Work Notes</Text>

      <Text style={styles.description}>
        All your work-related notes.
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search work notes..."
        value={searchText}
        onChangeText={setSearchText}
        autoCapitalize="none"
      />

      <FlatList
        data={filteredNotes}
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
              ? 'No work notes match your search.'
              : 'No work notes available.'}
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
    marginBottom: 15,
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
