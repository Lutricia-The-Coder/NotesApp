import React, { useCallback, useState } from 'react';
import {ActivityIndicator,Alert,Image,FlatList,Modal,Platform,Pressable,StatusBar,StyleSheet,Text,TextInput,TouchableOpacity,View,} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNavigation, BrandMark, BackHeader } from '../components/NotesUi';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import { Note, getUserNotes } from '../storage/storage';
import { Ionicons } from '@expo/vector-icons';
export type NoteCategory = 'All' | 'Work' | 'Study' | 'Personal';
type SortOrder = 'newest' | 'oldest';
type ScreenMode = 'list' | 'search';

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
  const { colors , lightTheme} = useAppTheme();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [screenMode, setScreenMode] = useState<ScreenMode>('list');
  const [loading, setLoading] = useState(true);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;

      const loadNotes = async () => {
        setLoading(true);
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
          <Ionicons
  name={getCategoryIcon(item.category)}
  size={16}
  color={colors.primary}
  style={{ marginRight: 7 }}
/>
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
               <Ionicons name="search-outline" size={20} color={colors.primary} />
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
    <Ionicons
      name="close-circle"
      size={21}
      color={colors.muted}
    />
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
              <Ionicons name="search-outline" size={20} color={colors.muted} />
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
    onPress={() => setSortMenuVisible(true)}
    accessibilityRole="button"
     accessibilityLabel="Sort notes"
    >
                <Ionicons name="options-outline" size={23} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        }
    ListEmptyComponent={
  loading ? (
    <ActivityIndicator color={colors.primary} />
  ) : searchText.trim() ? (
    <Text style={[styles.emptyText, { color: colors.muted }]}>
      {emptyText}
    </Text>
  ) : (
    <View style={styles.emptyState}>
     <Image
  source={
    lightTheme
      ? require('../../assets/empty-notes2.png')
      : require('../../assets/empty-notes.png')
  }
  style={styles.emptyImage}
  resizeMode="contain"
/>

      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No notes yet
      </Text>

      <Text style={[styles.emptyDescription, { color: colors.muted }]}>
        Your notes will appear here. Start by creating one!
      </Text>
    </View>
  )
}
      />
      <Modal
  visible={sortMenuVisible}
  transparent
  animationType="fade"
  statusBarTranslucent
  onRequestClose={() => setSortMenuVisible(false)}
>
  <View style={styles.sortModalRoot}>
    {/* Close menu when tapping outside */}
    <Pressable
      style={StyleSheet.absoluteFill}
      onPress={() => setSortMenuVisible(false)}
    />

    {/* Dropdown */}
    <View
      style={[
        styles.sortDropdown,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.sortDropdownHeading, { color: colors.muted }]}>
        SORT BY
      </Text>

      {(['newest', 'oldest'] as SortOrder[]).map((order) => {
        const selected = sortOrder === order;

        return (
          <TouchableOpacity
            key={order}
            style={styles.sortDropdownOption}
            onPress={() => {
              setSortOrder(order);
              setSortMenuVisible(false);
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
          >
            <Text
              style={[
                styles.sortDropdownText,
                {
                  color: selected ? colors.primary : colors.text,
                  fontWeight: selected ? '700' : '500',
                },
              ]}
            >
              {order === 'newest' ? 'Newest first' : 'Oldest first'}
            </Text>

            {selected && (
             <Ionicons name="checkmark" size={18} color={colors.primary} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
</Modal>
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

function getCategoryIcon(
  category: Note['category']
): keyof typeof Ionicons.glyphMap {
  switch (category) {
    case 'Work':
      return 'briefcase-outline';
    case 'Study':
      return 'book-outline';
    case 'Personal':
      return 'person-outline';
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
  textAlign: 'center',
  width: '100%',
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
 
  searchPlaceholder: {
    fontSize: 14,
  },
  searchField: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 11,
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
  noteCategory: {
  flexDirection: 'row',
  alignItems: 'center',
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
  sortModalRoot: {
  flex: 1,
},

sortDropdown: {
  position: 'absolute',
  top: 300,
  right: 24,
  width: 190,
  borderRadius: 16,
  borderWidth: 1,
  paddingVertical: 10,
  paddingHorizontal: 14,
  elevation: 8,
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.12,
  shadowRadius: 10,
},

sortDropdownHeading: {
  fontSize: 10,
  fontWeight: '700',
  letterSpacing: 1,
  paddingHorizontal: 8,
  paddingVertical: 8,
},

sortDropdownOption: {
  minHeight: 42,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 8,
},

sortDropdownText: {
  fontSize: 13,
}

,emptyState: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  paddingTop: 35,
},

emptyImage: {
  width: 190,
  height: 190,
  marginBottom: 16,
},

emptyTitle: {
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 8,
},

emptyDescription: {
  fontSize: 13,
  textAlign: 'center',
  lineHeight: 20,
  maxWidth: 250,
},
});
