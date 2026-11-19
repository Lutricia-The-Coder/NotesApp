
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';

import { useAuth } from '../context/AuthContext';

import {
  Note,
  getUserNotes,
} from '../storage/storage';

type StudyNotesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Study'
>;

export default function StudyNotesScreen({
  navigation,
}: StudyNotesScreenProps) {
  const { user } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);

  const loadNotes = async () => {
    if (user) {
      const savedNotes = await getUserNotes(user.id);

      const studyNotes = savedNotes.filter(
        (note) => note.category === 'Study'
      );

      setNotes(studyNotes);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);

    loadNotes();

    return unsubscribe;
  }, [navigation, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Study Notes</Text>

      <Text style={styles.description}>
        All your study-related notes.
      </Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>
              {item.title || 'Untitled Note'}
            </Text>

            <Text style={styles.noteContent}>
              {item.content}
            </Text>

            <Text style={styles.date}>
              Added: {new Date(item.dateAdded).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No study notes available.
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
