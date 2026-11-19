
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
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

export default function PersonalNotesScreen({
  navigation,
}: PersonalNotesScreenProps) {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personal Notes</Text>

      <Text style={styles.description}>
        All your personal notes.
      </Text>

      <FlatList
        data={notes}
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
            No personal notes available.
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
