import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeColors = {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  border: string;
  input: string;
  ring: string;
  background: string;
  foreground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
};

type ThemeContextType = {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors: ThemeColors = {
  primary: 'hsl(222.2 84% 4.9%)',
  primaryForeground: 'hsl(210 40% 98%)',
  secondary: 'hsl(210 40% 96%)',
  secondaryForeground: 'hsl(222.2 84% 4.9%)',
  accent: 'hsl(210 40% 96%)',
  accentForeground: 'hsl(222.2 84% 4.9%)',
  destructive: 'hsl(0 84.2% 60.2%)',
  destructiveForeground: 'hsl(210 40% 98%)',
  muted: 'hsl(210 40% 96%)',
  mutedForeground: 'hsl(215.4 16.3% 46.9%)',
  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(222.2 84% 4.9%)',
  popover: 'hsl(0 0% 100%)',
  popoverForeground: 'hsl(222.2 84% 4.9%)',
  border: 'hsl(214.3 31.8% 91.4%)',
  input: 'hsl(214.3 31.8% 91.4%)',
  ring: 'hsl(222.2 84% 4.9%)',
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222.2 84% 4.9%)',
  success: 'hsl(142.1 76.2% 36.3%)',
  successForeground: 'hsl(355.7 100% 97.3%)',
  warning: 'hsl(32.8 95% 44.1%)',
  warningForeground: 'hsl(0 0% 100%)',
  info: 'hsl(213.3 93.9% 67.5%)',
  infoForeground: 'hsl(0 0% 100%)',
};

const darkColors: ThemeColors = {
  primary: 'hsl(210 40% 98%)',
  primaryForeground: 'hsl(222.2 84% 4.9%)',
  secondary: 'hsl(217.2 32.6% 17.5%)',
  secondaryForeground: 'hsl(210 40% 98%)',
  accent: 'hsl(217.2 32.6% 17.5%)',
  accentForeground: 'hsl(210 40% 98%)',
  destructive: 'hsl(0 62.8% 30.6%)',
  destructiveForeground: 'hsl(210 40% 98%)',
  muted: 'hsl(217.2 32.6% 17.5%)',
  mutedForeground: 'hsl(215 20.2% 65.1%)',
  card: 'hsl(222.2 84% 4.9%)',
  cardForeground: 'hsl(210 40% 98%)',
  popover: 'hsl(222.2 84% 4.9%)',
  popoverForeground: 'hsl(210 40% 98%)',
  border: 'hsl(217.2 32.6% 17.5%)',
  input: 'hsl(217.2 32.6% 17.5%)',
  ring: 'hsl(212.7 26.8% 83.9%)',
  background: 'hsl(222.2 84% 4.9%)',
  foreground: 'hsl(210 40% 98%)',
  success: 'hsl(142.1 70.6% 45.3%)',
  successForeground: 'hsl(144.9 80.4% 10%)',
  warning: 'hsl(35.5 91.7% 32.9%)',
  warningForeground: 'hsl(0 0% 100%)',
  info: 'hsl(213.3 93.9% 67.5%)',
  infoForeground: 'hsl(0 0% 100%)',
};

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'hms-theme',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored) {
      setTheme(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const resolvedTheme = theme === 'system' ? systemTheme : theme;
    
    setActualTheme(resolvedTheme);
    
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);

    // Set CSS variables for the current theme
    const colors = resolvedTheme === 'dark' ? darkColors : lightColors;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
    
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'system';
      return 'light';
    });
  };

  const value = {
    theme,
    actualTheme,
    setTheme,
    colors: actualTheme === 'dark' ? darkColors : lightColors,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Animation and transition utilities
export const animations = {
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  slideInFromTop: 'animate-in slide-in-from-top-1 duration-300',
  slideInFromBottom: 'animate-in slide-in-from-bottom-1 duration-300',
  slideInFromLeft: 'animate-in slide-in-from-left-1 duration-300',
  slideInFromRight: 'animate-in slide-in-from-right-1 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-200',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
};

// Micro-interaction utilities
export const microInteractions = {
  hover: 'transition-all duration-200 hover:scale-105 hover:shadow-lg',
  press: 'transition-all duration-100 active:scale-95',
  focus: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
  glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-shadow duration-300',
  float: 'hover:translate-y-[-2px] transition-transform duration-200',
  rotate: 'hover:rotate-3 transition-transform duration-200',
  gradient: 'bg-gradient-to-r hover:bg-gradient-to-l transition-all duration-300',
};

// Status color utilities
export const statusColors = {
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    icon: 'text-green-600 dark:text-green-400',
    button: 'bg-green-600 hover:bg-green-700 text-white',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: 'text-yellow-600 dark:text-yellow-400',
    button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    icon: 'text-red-600 dark:text-red-400',
    button: 'bg-red-600 hover:bg-red-700 text-white',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    icon: 'text-blue-600 dark:text-blue-400',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  neutral: {
    bg: 'bg-gray-50 dark:bg-gray-900',
    border: 'border-gray-200 dark:border-gray-700',
    text: 'text-gray-800 dark:text-gray-200',
    icon: 'text-gray-600 dark:text-gray-400',
    button: 'bg-gray-600 hover:bg-gray-700 text-white',
  },
};

// Medical-specific color utilities
export const medicalColors = {
  critical: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    border: 'border-red-300 dark:border-red-700',
    text: 'text-red-900 dark:text-red-300',
    accent: 'bg-red-600',
  },
  urgent: {
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    border: 'border-orange-300 dark:border-orange-700',
    text: 'text-orange-900 dark:text-orange-300',
    accent: 'bg-orange-600',
  },
  stable: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-900 dark:text-green-300',
    accent: 'bg-green-600',
  },
  pending: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    border: 'border-yellow-300 dark:border-yellow-700',
    text: 'text-yellow-900 dark:text-yellow-300',
    accent: 'bg-yellow-600',
  },
};

// Department-specific colors
export const departmentColors = {
  emergency: 'bg-red-600',
  cardiology: 'bg-pink-600',
  neurology: 'bg-purple-600',
  orthopedics: 'bg-blue-600',
  pediatrics: 'bg-cyan-600',
  oncology: 'bg-indigo-600',
  surgery: 'bg-green-600',
  radiology: 'bg-teal-600',
  laboratory: 'bg-orange-600',
  pharmacy: 'bg-lime-600',
  default: 'bg-gray-600',
};
