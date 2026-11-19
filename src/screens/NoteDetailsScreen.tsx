
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getNotes, Note } from '../storage/storage';

type NoteDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NoteDetails'
>;

export default function NoteDetailsScreen({
  route,
}: NoteDetailsScreenProps) {
  const { noteId } = route.params;

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const notes = await getNotes();

        const selectedNote = notes.find(
          (item) => item.id === noteId
        );

        setNote(selectedNote ?? null);
      } catch (error) {
        console.log('Error loading note:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333333" />
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Note not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.category}>{note.category}</Text>

        <Text style={styles.title}>
          {note.title || 'Untitled Note'}
        </Text>

        <Text style={styles.content}>{note.content}</Text>

        <View style={styles.divider} />

        <Text style={styles.date}>
          Date added: {new Date(note.dateAdded).toLocaleString()}
        </Text>

        {note.dateEdited && (
          <Text style={styles.date}>
            Last edited: {new Date(note.dateEdited).toLocaleString()}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  category: {
    fontSize: 14,
    color: '#666666',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 25,
  },
  divider: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginVertical: 20,
  },
  date: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666666',
  },
});
