
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';

import { useAuth } from '../context/AuthContext';

import {
  Note,
  getNotes,
  updateNote,
} from '../storage/storage';

type EditNoteScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EditNote'
>;

type NoteCategory = 'Work' | 'Study' | 'Personal';

export default function EditNoteScreen({
  route,
  navigation,
}: EditNoteScreenProps) {
  const { noteId } = route.params;
  const { user } = useAuth();

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('Work');
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
          setTitle(foundNote.title);
          setContent(foundNote.content);
          setCategory(foundNote.category);
        } else {
          Alert.alert('Error', 'Note not found.');
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to load note.');
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId, user]);

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
    } catch (error) {
      Alert.alert('Error', 'Unable to update your note.');
    }
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
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.heading}>Edit Note</Text>

        <Text style={styles.label}>Title (Optional)</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter note title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Note</Text>

        <TextInput
          style={styles.contentInput}
          placeholder="Write your note here..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Select Category</Text>

        <View style={styles.categoryContainer}>
          {(['Work', 'Study', 'Personal'] as NoteCategory[]).map(
            (item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  category === item && styles.selectedCategory,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === item && styles.selectedCategoryText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdateNote}
        >
          <Text style={styles.saveButtonText}>Update Note</Text>
        </TouchableOpacity>
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

  form: {
    padding: 20,
  },

  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },

  contentInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    height: 180,
    fontSize: 16,
    marginBottom: 20,
  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  categoryButton: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  selectedCategory: {
    backgroundColor: '#333333',
    borderColor: '#333333',
  },

  categoryText: {
    color: '#333333',
    fontWeight: 'bold',
  },

  selectedCategoryText: {
    color: '#FFFFFF',
  },

  saveButton: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
