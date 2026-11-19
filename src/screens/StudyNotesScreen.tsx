import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import NotesListScreen, { NoteCategory } from './NotesListScreen';

type StudyNotesScreenProps = NativeStackScreenProps<RootStackParamList, 'Study'>;

export default function StudyNotesScreen({
  navigation,
}: StudyNotesScreenProps) {
  const selectCategory = (category: NoteCategory) => {
    if (category === 'All') {
      navigation.navigate('Home');
    } else {
      navigation.navigate(category);
    }
  };

  return (
    <NotesListScreen
      category="Study"
      onSelectCategory={selectCategory}
      onOpenNote={(noteId) =>
        navigation.navigate('NoteDetails', { noteId })
      }
      onOpenAddNote={() => navigation.navigate('AddNote')}
      onOpenProfile={() => navigation.navigate('Profile')}
    />
  );
}
