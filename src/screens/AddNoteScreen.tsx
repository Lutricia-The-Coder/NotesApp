import React, { useState } from 'react';

import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import NoteEditor from '../components/NoteEditor';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { addNote, Note } from '../storage/storage';

type AddNoteScreenProps = NativeStackScreenProps<RootStackParamList, 'AddNote'>;

export default function AddNoteScreen({
  navigation,
}: AddNoteScreenProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Note['category']>('Work');
  const [saving, setSaving] = useState(false);

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
      setSaving(true);
      const newNote: Note = {
        id: Date.now().toString(),
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        category,
        dateAdded: new Date().toISOString(),
      };

      await addNote(newNote);
      Alert.alert('Success', 'Your note has been saved!');
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Unable to save your note.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <NoteEditor
      heading="New note"
      title={title}
      content={content}
      category={category}
      saveLabel="Save note"
      saving={saving}
      onTitleChange={setTitle}
      onContentChange={setContent}
      onCategoryChange={setCategory}
      onBack={() => navigation.goBack()}
      onSave={() => void handleAddNote()}
    />
  );
}
