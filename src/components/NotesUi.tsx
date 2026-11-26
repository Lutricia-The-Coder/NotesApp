import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text,TouchableOpacity, View,} from 'react-native';

import { useAppTheme } from '../context/ThemeContext';

export function BrandMark() {
  const { colors } = useAppTheme();

  return (
    <Text style={[styles.brandMark, { color: colors.primary }]}>
      petal 
    </Text>
  );
}

export function BackHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.soft }]}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
       <Ionicons
  name="chevron-back"
  size={24}
  color={colors.primary}
/>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: colors.text }]}>
        {title}
      </Text>
    </View>
  );
}

export function BottomNavigation({
  active,
  onNotes,
  onAdd,
  onProfile,
}: {
  active: 'notes' | 'profile';
  onNotes: () => void;
  onAdd: () => void;
  onProfile: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.bottomNav,
        { backgroundColor: colors.background },
      ]}
    >
      {active === 'notes' ? (
        <TouchableOpacity
          style={[styles.activeNavItem, { backgroundColor: colors.soft }]}
          onPress={onNotes}
          accessibilityRole="tab"
          accessibilityState={{ selected: true }}
          accessibilityLabel="Notes"
        >
       <Ionicons name="document-text-outline" size={22} color={colors.primary} />
          <Text style={[styles.navLabel, { color: colors.softText }]}>
            Notes
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.navItem}
          onPress={onNotes}
          accessibilityRole="button"
          accessibilityLabel="Notes"
        >
          <NoteIcon color={colors.muted} />
          <Text style={[styles.navLabel, { color: colors.muted }]}>
            Notes
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel="Add a note"
      >
       <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {active === 'profile' ? (
        <TouchableOpacity
          style={[styles.activeNavItem, { backgroundColor: colors.soft }]}
          onPress={onProfile}
          accessibilityRole="tab"
          accessibilityState={{ selected: true }}
          accessibilityLabel="Profile"
        >
        <Ionicons name="person-circle-outline" size={23} color={colors.primary} /> 
          <Text style={[styles.navLabel, { color: colors.softText }]}>
            Profile
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.navItem}
          onPress={onProfile}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          <Ionicons name="person-circle-outline" size={23} color={colors.primary} />
          <Text style={[styles.navLabel, { color: colors.muted }]}>
            Profile
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function LockMark({ color }: { color: string }) {
  return (
    <View style={styles.lockIcon} accessible={false}>
      <View style={[styles.lockShackle, { borderColor: color }]} />
      <View style={[styles.lockBody, { borderColor: color }]} />
    </View>
  );
}

function NoteIcon({ color }: { color: string }) {
  return (
    <View style={[styles.noteIcon, { borderColor: color }]} accessible={false}>
      <View style={[styles.noteIconLine, { backgroundColor: color }]} />
      <View style={[styles.noteIconLine, { backgroundColor: color }]} />
      <View style={[styles.noteIconLine, { backgroundColor: color }]} />
    </View>
  );
}

function ProfileIcon({ color }: { color: string }) {
  return (
    <View style={styles.profileIcon} accessible={false}>
      <View style={[styles.profileHead, { borderColor: color }]} />
      <View style={[styles.profileShoulders, { borderColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  brandMark: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  backArrow: {
    fontSize: 30,
    lineHeight: 34,
    marginTop: -3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  bottomNav: {
    minHeight: 76,
    paddingHorizontal: 24,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navItem: {
    width: 88,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNavItem: {
    width: 88,
    height: 56,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  noteIcon: {
    width: 15,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    marginBottom: 3,
  },
  noteIconLine: {
    width: 7,
    height: 1,
    marginVertical: 1,
  },
  profileIcon: {
    width: 22,
    height: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 3,
  },
  profileHead: {
    width: 8,
    height: 8,
    borderWidth: 1.5,
    borderRadius: 4,
    marginBottom: 1,
  },
  profileShoulders: {
    width: 16,
    height: 8,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  addButton: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
    marginTop: -2,
  },
  lockIcon: {
    width: 30,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockShackle: {
    width: 12,
    height: 13,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lockBody: {
    width: 20,
    height: 16,
    borderWidth: 2,
    borderRadius: 5,
    marginTop: -1,
  },
});
