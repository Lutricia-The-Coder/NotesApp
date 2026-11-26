import React from 'react';

import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackHeader } from './NotesUi';
import { useAppTheme } from '../context/ThemeContext';
import { Note } from '../storage/storage';

interface NoteEditorProps {
  heading: string;
  title: string;
  content: string;
  category: Note['category'];
  saveLabel: string;
  saving: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCategoryChange: (value: Note['category']) => void;
  onBack: () => void;
  onSave: () => void;
}

const categories: Note['category'][] = ['Work', 'Study', 'Personal'];

export default function NoteEditor({
  heading,
  title,
  content,
  category,
  saveLabel,
  saving,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onBack,
  onSave,
}: NoteEditorProps) {
  const { colors } = useAppTheme();
  const inputStyle = {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BackHeader title={heading} onBack={onBack} />
        

        <Text style={[styles.fieldLabel, { color: colors.label }]}>
          TITLE - OPTIONAL
        </Text>
        <TextInput
          style={[styles.titleInput, inputStyle]}
          placeholder="Give your thought a title"
          placeholderTextColor={colors.muted}
          value={title}
          onChangeText={onTitleChange}
          accessibilityLabel="Optional note title"
        />

        <Text style={[styles.fieldLabel, styles.categoryLabel, { color: colors.label }]}>
          CATEGORY
        </Text>
        <View style={styles.categoryRow}>
          {categories.map((item) => {
            const selected = category === item;
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selected ? colors.soft : colors.surface,
                    borderColor: selected ? colors.soft : colors.border,
                  },
                ]}
                onPress={() => onCategoryChange(item)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { color: selected ? colors.softText : colors.muted },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.fieldLabel, styles.noteLabel, { color: colors.label }]}>
          YOUR NOTE
        </Text>
        <TextInput
          style={[styles.noteInput, inputStyle]}
          placeholder="Write your note here..."
          placeholderTextColor={colors.muted}
          value={content}
          onChangeText={onContentChange}
          multiline
          textAlignVertical="top"
          accessibilityLabel="Note content"
        />

       <TouchableOpacity
  style={[
    styles.saveButton,
    { backgroundColor: colors.primary },
    saving && styles.disabledButton,
  ]}
  onPress={onSave}
  disabled={saving}
  accessibilityRole="button"
  accessibilityLabel={saving ? 'Saving note' : saveLabel}
>
  <Text style={styles.saveButtonText}>
    {saving ? 'Saving...' : saveLabel}
  </Text>
</TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 34,
  },
  description: {
    fontSize: 14,
    marginTop: -12,
    marginBottom: 28,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  titleInput: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 15,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 23,
    marginBottom: 26,
  },
  categoryLabel: {
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  categoryButton: {
    flex: 1,
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  noteLabel: {
    marginBottom: 10,
  },
  noteInput: {
    minHeight: 230,
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 22,
  },
  saveButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
