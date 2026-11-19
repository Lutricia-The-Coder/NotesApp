
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import { Note, getNotes } from '../storage/storage';
import { useAuth } from '../context/AuthContext';

type NoteDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NoteDetails'
>;

export default function NoteDetailsScreen({
  route,
}: NoteDetailsScreenProps) {
  const { noteId } = route.params;
  const { user } = useAuth();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const notes = await getNotes();

        const foundNote = notes.find(
          (item) =>
            item.id === noteId &&
            item.userId === user?.id
        );

        if (foundNote) {
          setNote(foundNote);
        } else {
          Alert.alert('Error', 'Note not found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to load this note.');
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId, user]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

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
        <Text>Note not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.category}>{note.category}</Text>

      <Text style={styles.title}>
        {note.title || 'Untitled Note'}
      </Text>

      <Text style={styles.dateLabel}>Date Added</Text>
      <Text style={styles.date}>
        {formatDate(note.dateAdded)}
      </Text>

      {note.dateEdited && (
        <>
          <Text style={styles.dateLabel}>Last Edited</Text>
          <Text style={styles.date}>
            {formatDate(note.dateEdited)}
          </Text>
        </>
      )}

      <View style={styles.divider} />

      <Text style={styles.content}>{note.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: '#777777',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 25,
  },
  dateLabel: {
    fontSize: 13,
    color: '#777777',
    marginTop: 10,
  },
  date: {
    fontSize: 14,
    color: '#333333',
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginVertical: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 25,
    color: '#333333',
  },
});
