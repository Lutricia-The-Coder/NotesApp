
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';

import { useAuth } from '../context/AuthContext';

import { addNote, Note } from '../storage/storage';

type AddNoteScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AddNote'
>;

type NoteCategory = 'Work' | 'Study' | 'Personal';

export default function AddNoteScreen({
  navigation,
}: AddNoteScreenProps) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [category, setCategory] = useState<NoteCategory>('Work');

  // Save a new note
  const handleAddNote = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some note content.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a note.');
      return;
    }

    try {
      const newNote: Note = {
        id: Date.now().toString(),
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        category: category,
        dateAdded: new Date().toISOString(),
      };

      await addNote(newNote);

      Alert.alert('Success', 'Your note has been saved!');

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Unable to save your note.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>

        <Text style={styles.heading}>Create a New Note</Text>

        {/* Note title */}
        <Text style={styles.label}>
          Title (Optional)
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter note title"
          value={title}
          onChangeText={setTitle}
        />

        {/* Note content */}
        <Text style={styles.label}>
          Note
        </Text>

        <TextInput
          style={styles.contentInput}
          placeholder="Write your note here..."
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {/* Note category */}
        <Text style={styles.label}>
          Select Category
        </Text>

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

        {/* Save note button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleAddNote}
        >
          <Text style={styles.saveButtonText}>
            Save Note
          </Text>
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
    fontSize: 16,
    height: 180,
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
    fontWeight: '600',
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
