import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import NotesListScreen, { NoteCategory } from './NotesListScreen';

type WorkNotesScreenProps = NativeStackScreenProps<RootStackParamList, 'Work'>;

export default function WorkNotesScreen({
  navigation,
}: WorkNotesScreenProps) {
  const selectCategory = (category: NoteCategory) => {
    if (category === 'All') {
      navigation.navigate('Home');
    } else {
      navigation.navigate(category);
    }
  };

  return (
    <NotesListScreen
      category="Work"
      onSelectCategory={selectCategory}
      onOpenNote={(noteId) =>
        navigation.navigate('NoteDetails', { noteId })
      }
      onOpenAddNote={() => navigation.navigate('AddNote')}
      onOpenProfile={() => navigation.navigate('Profile')}
    />
  );
}
