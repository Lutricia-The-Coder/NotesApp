import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackHeader } from '../components/NotesUi';
import NoteEditor from '../components/NoteEditor';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { Note, getNotes, updateNote } from '../storage/storage';

type EditNoteScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditNote'
>;

export default function EditNoteScreen({
  route,
  navigation,
}: EditNoteScreenProps) {
  const { noteId } = route.params;
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Note['category']>('Work');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    const loadNote = async () => {
      try {
        const notes = await getNotes();
        const foundNote = notes.find(
          (item) => item.id === noteId && item.userId === user?.id
        );

        if (isCurrent && foundNote) {
          setNote(foundNote);
          setTitle(foundNote.title);
          setContent(foundNote.content);
          setCategory(foundNote.category);
        } else if (isCurrent) {
          Alert.alert('Error', 'Note not found.');
        }
      } catch {
        if (isCurrent) {
          Alert.alert('Error', 'Unable to load note.');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    void loadNote();
    return () => {
      isCurrent = false;
    };
  }, [noteId, user?.id]);

  const handleUpdateNote = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some note content.');
      return;
    }

    if (!note || !user) {
      Alert.alert('Error', 'Unable to update this note.');
      return;
    }

    try {
      setSaving(true);
      const updatedNote: Note = {
        ...note,
        title: title.trim(),
        content: content.trim(),
        category,
        dateEdited: new Date().toISOString(),
      };

      await updateNote(updatedNote);
      Alert.alert('Success', 'Your note has been updated!');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Unable to update your note.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.center, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!note) {
    return (
      <SafeAreaView
        style={[styles.errorScreen, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle="dark-content" />
        <BackHeader
          title="Edit note"
          onBack={() => navigation.goBack()}
        />
        <Text style={[styles.errorText, { color: colors.muted }]}>
          Note not found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <NoteEditor
      heading="Edit note"
      title={title}
      content={content}
      category={category}
      saveLabel="Save changes"
      saving={saving}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onCategoryChange={setCategory}
      onBack={() => navigation.goBack()}
      onSave={() => void handleUpdateNote()}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorScreen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 32,
  },
});
