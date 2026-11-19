import React, { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation, BrandMark, BackHeader } from '../components/NotesUi';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { Note, getUserNotes } from '../storage/storage';

export type NoteCategory = 'All' | 'Work' | 'Study' | 'Personal';
type SortOrder = 'newest' | 'oldest';
type ScreenMode = 'list' | 'search' | 'sort';

interface NotesListScreenProps {
  category: NoteCategory;
  onSelectCategory: (category: NoteCategory) => void;
  onOpenNote: (noteId: string) => void;
  onOpenAddNote: () => void;
  onOpenProfile: () => void;
}

export default function NotesListScreen({
  category,
  onSelectCategory,
  onOpenNote,
  onOpenAddNote,
  onOpenProfile,
}: NotesListScreenProps) {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [screenMode, setScreenMode] = useState<ScreenMode>('list');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;

      const loadNotes = async () => {
        if (!user) {
          setNotes([]);
          setLoading(false);
          return;
        }

        try {
          const savedNotes = await getUserNotes(user.id);
          if (isCurrent) {
            setNotes(
              category === 'All'
                ? savedNotes
                : savedNotes.filter((note) => note.category === category)
            );
          }
        } catch {
          Alert.alert('Error', 'Unable to load your notes.');
        } finally {
          if (isCurrent) {
            setLoading(false);
          }
        }
      };

      void loadNotes();
      return () => {
        isCurrent = false;
      };
    }, [category, user])
  );

  const matchingNotes = notes.filter((note) => {
    const words = searchText
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const content = `${note.title} ${note.content}`.toLowerCase();
    return words.every((word) => content.includes(word));
  });

  const sortedNotes = [...matchingNotes].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const screenTitle = category === 'All' ? 'My notes' : category;
  const sectionTitle =
    category === 'All' ? 'All your notes' : `A space for ${category.toLowerCase()}`;
  const description =
    category === 'All'
      ? 'A little space for every thought.'
      : 'Ideas, plans & everything in between.';

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[
        styles.noteCard,
        {
          backgroundColor: getCategoryColor(item.category, colors),
          borderColor: colors.border,
        },
      ]}
      onPress={() => onOpenNote(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`${item.title || 'Untitled note'}, ${item.category}`}
    >
      <View style={styles.noteMeta}>
        <View style={styles.noteCategory}>
          <Text style={[styles.noteCategoryIcon, { color: colors.primary }]}>
            {getCategoryIcon(item.category)}
          </Text>
          <Text style={[styles.noteCategoryText, { color: colors.softText }]}>
            {item.category.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.noteDate, { color: colors.muted }]}>
          {formatDate(item.dateAdded)}
        </Text>
      </View>
      <Text style={[styles.noteTitle, { color: colors.text }]}>
        {item.title || 'Untitled Note'}
      </Text>
      <Text
        style={[styles.noteContent, { color: colors.muted }]}
        numberOfLines={2}
      >
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  const emptyText = searchText.trim()
    ? 'No notes match your search.'
    : 'No notes yet. Make a little room for a new thought.';

  if (screenMode === 'sort') {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle="dark-content" />
        <View style={styles.modeContent}>
          <BackHeader
            title="Sort notes"
            onBack={() => setScreenMode('list')}
          />
          
          <Text style={[styles.sortHeadline, { color: colors.text }]}>
            A little order, your way.
          </Text>
          <Text style={[styles.sortDescription, { color: colors.muted }]}>
            Sort by the date each note was added.
          </Text>
          {(['newest', 'oldest'] as SortOrder[]).map((order) => {
            const selected = sortOrder === order;
            return (
              <TouchableOpacity
                key={order}
                style={[
                  styles.sortOption,
                  {
                    backgroundColor: selected ? colors.soft : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSortOrder(order)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
              >
                <View>
                  <Text style={[styles.sortTitle, { color: colors.text }]}>
                    {order === 'newest' ? 'Newest first' : 'Oldest first'}
                  </Text>
                  <Text style={[styles.sortSubtitle, { color: colors.muted }]}>
                    {order === 'newest'
                      ? 'Date added · descending'
                      : 'Date added · ascending'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    selected && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  {selected && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <BottomNavigation
          active="notes"
          onNotes={() => onSelectCategory('All')}
          onAdd={onOpenAddNote}
          onProfile={onOpenProfile}
        />
      </SafeAreaView>
    );
  }

  if (screenMode === 'search') {
    return (
      <SafeAreaView
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle="dark-content" />
        <FlatList
          style={styles.scroll}
          contentContainerStyle={styles.modeContent}
          data={sortedNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
          ListHeaderComponent={
            <>
              <BackHeader
                title="Search notes"
                onBack={() => setScreenMode('list')}
              />
              <Text style={[styles.modeDescription, { color: colors.muted }]}>
                A little space to make it yours.
              </Text>
              <View
                style={[
                  styles.searchBar,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Text style={[styles.searchIcon, { color: colors.primary }]}>
                  ⌕
                </Text>
                <TextInput
                  style={[styles.searchField, { color: colors.text }]}
                  placeholder="Search your thoughts..."
                  placeholderTextColor={colors.muted}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoCapitalize="none"
                  autoFocus
                  accessibilityLabel="Search notes"
                />
                {searchText.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchText('')}
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                  >
                    <Text style={[styles.clearSearch, { color: colors.muted }]}>
                      ×
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={[styles.resultCount, { color: colors.text }]}>
                {sortedNotes.length}{' '}
                {sortedNotes.length === 1 ? 'note' : 'notes'} found
              </Text>
              <Text style={[styles.resultDescription, { color: colors.muted }]}>
                {searchText.trim()
                  ? `Matching “${searchText.trim()}” in your notes`
                  : 'Matching notes from your account'}
              </Text>
            </>
          }
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {emptyText}
            </Text>
          }
        />
        <BottomNavigation
          active="notes"
          onNotes={() => onSelectCategory('All')}
          onAdd={onOpenAddNote}
          onProfile={onOpenProfile}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="dark-content" />
      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        data={sortedNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        ListHeaderComponent={
          <>
            <View style={styles.brandRow}>
              <BrandMark />
            </View>
            <Text style={[styles.screenTitle, { color: colors.text }]}>
              {screenTitle}
            </Text>
            <Text style={[styles.screenDescription, { color: colors.muted }]}>
              {description}
            </Text>

            <TouchableOpacity
              style={[
                styles.searchBar,
                { backgroundColor: colors.surface, borderColor: colors.surface },
              ]}
              onPress={() => setScreenMode('search')}
              accessibilityRole="button"
              accessibilityLabel="Search your thoughts"
            >
              <Text style={[styles.searchIcon, { color: colors.muted }]}>
                ⌕
              </Text>
              <Text style={[styles.searchPlaceholder, { color: colors.muted }]}>
                Search your thoughts...
              </Text>
            </TouchableOpacity>

            <View style={styles.categoryRow}>
              {(['All', 'Work', 'Study', 'Personal'] as NoteCategory[]).map(
                (item) => {
                  const selected = item === category;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: selected
                            ? colors.primary
                            : colors.surface,
                        },
                      ]}
                      onPress={() => onSelectCategory(item)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          { color: selected ? '#FFFFFF' : colors.muted },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            <View style={styles.sectionHeader}>
              <View style={styles.sectionCopy}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {sectionTitle}
                </Text>
                <Text style={[styles.sectionMeta, { color: colors.muted }]}>
                  {sortedNotes.length}{' '}
                  {sortedNotes.length === 1 ? 'note' : 'notes'} ·{' '}
                  {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.sortButton, { backgroundColor: colors.soft }]}
                onPress={() => setScreenMode('sort')}
                accessibilityRole="button"
                accessibilityLabel="Sort notes"
              >
                <Text style={[styles.sortIcon, { color: colors.primary }]}>
                  ≡
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              {emptyText}
            </Text>
          )
        }
      />
      <BottomNavigation
        active="notes"
        onNotes={() => onSelectCategory('All')}
        onAdd={onOpenAddNote}
        onProfile={onOpenProfile}
      />
    </SafeAreaView>
  );
}

function getCategoryColor(
  category: Note['category'],
  colors: ReturnType<typeof useAppTheme>['colors']
) {
  switch (category) {
    case 'Work':
      return colors.workCard;
    case 'Study':
      return colors.studyCard;
    case 'Personal':
      return colors.personalCard;
  }
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
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modeContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  screenTitle: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 32,
    lineHeight: 40,
  },
  screenDescription: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 22,
  },
  searchBar: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 24,
    lineHeight: 28,
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
  },
  searchField: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 11,
  },
  clearSearch: {
    fontSize: 23,
    paddingHorizontal: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  categoryButton: {
    minWidth: 54,
    height: 38,
    paddingHorizontal: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionCopy: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  sectionMeta: {
    fontSize: 12,
  },
  sortButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  sortIcon: {
    fontSize: 26,
    lineHeight: 30,
    marginTop: -3,
  },
  noteCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0E7EA',
    padding: 16,
    marginBottom: 12,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  noteCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteCategoryIcon: {
    fontSize: 15,
    marginRight: 7,
  },
  noteCategoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  noteDate: {
    fontSize: 10,
  },
  noteTitle: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 21,
    lineHeight: 27,
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  modeDescription: {
    fontSize: 14,
    marginTop: -12,
    marginBottom: 26,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 12,
    marginBottom: 18,
  },
  sortHeadline: {
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    fontSize: 25,
    lineHeight: 33,
    marginBottom: 8,
  },
  sortDescription: {
    fontSize: 13,
    marginBottom: 28,
  },
  sortOption: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 20,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sortTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  sortSubtitle: {
    fontSize: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#D9CDD2',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
