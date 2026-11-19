import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';

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
  blueTheme: boolean;
  setBlueTheme: (enabled: boolean) => void;
}

const palettes: { pink: AppColors; blue: AppColors } = {
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
  blue: {
    background: '#F3F8FF',
    surface: '#FFFFFF',
    text: '#26364B',
    muted: '#718198',
    label: '#40536D',
    border: '#D8E4F3',
    primary: '#3478D4',
    soft: '#E2EDFC',
    softText: '#2D66B1',
    workCard: '#FFFFFF',
    studyCard: '#EFF3FC',
    personalCard: '#EAF3FF',
    danger: '#B43C4B',
    dangerSoft: '#FFF0F1',
  },
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [blueTheme, setBlueTheme] = useState(false);

  return (
    <ThemeContext.Provider
      value={{
        colors: blueTheme ? palettes.blue : palettes.pink,
        blueTheme,
        setBlueTheme,
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
