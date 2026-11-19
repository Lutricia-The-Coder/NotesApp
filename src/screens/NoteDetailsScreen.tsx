import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackHeader } from '../components/NotesUi';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { deleteNote, getNotes, Note } from '../storage/storage';

type NoteDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'NoteDetails'
>;

export default function NoteDetailsScreen({
  route,
  navigation,
}: NoteDetailsScreenProps) {
  const { noteId } = route.params;
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        } else if (isCurrent) {
          Alert.alert('Error', 'Note not found.');
        }
      } catch {
        if (isCurrent) {
          Alert.alert('Error', 'Unable to load this note.');
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

  const handleDeleteNote = async () => {
    if (!note || !user) {
      Alert.alert('Error', 'Unable to delete this note.');
      return;
    }

    try {
      setDeleting(true);
      await deleteNote(note.id, user.id);
      Alert.alert('Success', 'Your note has been deleted.');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Unable to delete your note.');
    } finally {
      setDeleting(false);
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
          title="Your note"
          onBack={() => navigation.goBack()}
        />
        <Text style={[styles.errorText, { color: colors.muted }]}>
          Note not found.
        </Text>
      </SafeAreaView>
    );
  }

  if (confirmDelete) {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.confirmContent}>
          <BackHeader
            title="Delete note"
            onBack={() => setConfirmDelete(false)}
          />
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            A little space to make it yours.
          </Text>
          <View style={[styles.deleteIconTile, { backgroundColor: colors.soft }]}>
            <Text style={[styles.trashIcon, { color: colors.primary }]}>▤</Text>
          </View>
          <Text style={[styles.confirmTitle, { color: colors.text }]}>
            Let this thought go?
          </Text>
          <Text style={[styles.confirmDescription, { color: colors.muted }]}>
            {note.title
              ? `“${note.title}” will be permanently deleted.`
              : 'This note will be permanently deleted.'}
            {'\n'}This can&apos;t be undone.
          </Text>
          <TouchableOpacity
            style={[
              styles.deleteButton,
              { backgroundColor: colors.primary },
              deleting && styles.disabledButton,
            ]}
            onPress={() => void handleDeleteNote()}
            disabled={deleting}
            accessibilityRole="button"
          >
            <Text style={styles.deleteButtonText}>
              {deleting ? 'Deleting...' : 'Delete note'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => setConfirmDelete(false)}
            disabled={deleting}
            accessibilityRole="button"
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Keep this note
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <BackHeader
          title="Your note"
          onBack={() => navigation.goBack()}
        />
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          A little space to make it yours.
        </Text>

        <View style={[styles.categoryChip, { backgroundColor: colors.soft }]}>
          <Text style={[styles.categoryIcon, { color: colors.primary }]}>
            {getCategoryIcon(note.category)}
          </Text>
          <Text style={[styles.categoryText, { color: colors.softText }]}>
            {note.category}
          </Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          {note.title || 'Untitled Note'}
        </Text>
        <Text style={[styles.date, { color: colors.muted }]}>
          Added {formatDate(note.dateAdded)}
        </Text>
        {note.dateEdited && (
          <Text style={[styles.editedDate, { color: colors.softText }]}>
            Edited {formatDate(note.dateEdited)}
          </Text>
        )}

        <View
          style={[
            styles.noteContentCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.noteContent, { color: colors.text }]}>
            {note.content}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() =>
            navigation.navigate('EditNote', { noteId: note.id })
          }
          accessibilityRole="button"
        >
          <Text style={styles.editButtonText}>Edit note</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deleteLink,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => setConfirmDelete(true)}
          accessibilityRole="button"
        >
          <Text style={[styles.deleteLinkText, { color: colors.danger }]}>
            Delete note
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function getCategoryIcon(category: Note['category']) {
  switch (category) {
    case 'Work':
      return '▣';
    case 'Study':
      return '◫';
    case 'Personal':
      return '♡';
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 34,
  },
  confirmContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorScreen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
    marginTop: -12,
    marginBottom: 22,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    minHeight: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  categoryIcon: {
    fontSize: 15,
    marginRight: 7,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 14,
  },
  date: {
    fontSize: 12,
    marginBottom: 5,
  },
  editedDate: {
    fontSize: 12,
    marginBottom: 22,
  },
  noteContentCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    minHeight: 190,
    marginTop: 12,
    marginBottom: 22,
  },
  noteContent: {
    fontSize: 15,
    lineHeight: 24,
  },
  editButton: {
    minHeight: 52,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteLink: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteLinkText: {
    fontSize: 15,
    fontWeight: '700',
  },
  deleteIconTile: {
    width: 88,
    height: 88,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 26,
  },
  trashIcon: {
    fontSize: 36,
    lineHeight: 42,
  },
  confirmTitle: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmDescription: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 28,
  },
  deleteButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
