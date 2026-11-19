import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/types';
import NotesListScreen, { NoteCategory } from './NotesListScreen';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const selectCategory = (category: NoteCategory) => {
    if (category === 'All') {
      navigation.navigate('Home');
    } else {
      navigation.navigate(category);
    }
  };

  return (
    <NotesListScreen
      category="All"
      onSelectCategory={selectCategory}
      onOpenNote={(noteId) =>
        navigation.navigate('NoteDetails', { noteId })
      }
      onOpenAddNote={() => navigation.navigate('AddNote')}
      onOpenProfile={() => navigation.navigate('Profile')}
    />
  );
}
