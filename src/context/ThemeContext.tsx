
import React, { createContext, ReactNode,useContext, useState,} from 'react';

export interface AppColors {
  background: string;
  surface: string;
  text: string;
  muted: string;
  label: string;
  border: string;
  primary: string;
  soft: string;
  softText: string;
  workCard: string;
  studyCard: string;
  personalCard: string;
  danger: string;
  dangerSoft: string;
}

interface ThemeContextValue {
  colors: AppColors;
  lightTheme: boolean;
  setLightTheme: (enabled: boolean) => void;
}

const palettes: { pink: AppColors; black: AppColors } = {
  pink: {
    background: '#FFF8FA',
    surface: '#FFFFFF',
    text: '#3A3035',
    muted: '#85777D',
    label: '#55454B',
    border: '#EADDE2',
    primary: '#AA4168',
    soft: '#F8E3EB',
    softText: '#8F3859',
    workCard: '#FFFFFF',
    studyCard: '#F4EFFA',
    personalCard: '#FCEBF1',
    danger: '#B43C4B',
    dangerSoft: '#FFF0F1',
  },
  black: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#171717',
    muted: '#737373',
    label: '#404040',
    border: '#E0E0E0',
    primary: '#171717',
    soft: '#EAEAEA',
    softText: '#262626',
    workCard: '#FFFFFF',
    studyCard: '#F0F0F0',
    personalCard: '#E8E8E8',
    danger: '#B43C4B',
    dangerSoft: '#FFF0F1',
  },
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [lightTheme, setLightTheme] = useState(false);

  return (
    <ThemeContext.Provider
      value={{
        colors: lightTheme ? palettes.black : palettes.pink,
        lightTheme,
        setLightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }

  return context;
}
