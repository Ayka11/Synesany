import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    name: 'dark',
    displayName: 'Night Mode',
    icon: '🌙',
    colors: {
      background: 'from-[#0a0a0c] via-[#111115] to-[#0a0a0c]',
      surface: 'bg-black/40',
      card: 'bg-white/5',
      cardHover: 'bg-white/10',
      border: 'border-white/10',
      borderHover: 'border-white/20',
      text: 'text-white',
      textSecondary: 'text-white/60',
      textMuted: 'text-white/40',
      accent: 'from-indigo-400 to-purple-400',
      accentBg: 'bg-indigo-500',
      accentHover: 'bg-indigo-600',
      success: 'text-green-400',
      successBg: 'bg-green-500/10',
      warning: 'text-yellow-400',
      warningBg: 'bg-yellow-500/10',
      error: 'text-red-400',
      errorBg: 'bg-red-500/10',
      scrollbar: 'scrollbar-thumb-white/10',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
  },
  light: {
    name: 'light',
    displayName: 'Day Mode',
    icon: '☀️',
    colors: {
      background: 'from-gray-50 via-white to-gray-100',
      surface: 'bg-white/80',
      card: 'bg-white',
      cardHover: 'bg-gray-50',
      border: 'border-gray-200',
      borderHover: 'border-gray-300',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      accent: 'from-indigo-600 to-purple-600',
      accentBg: 'bg-indigo-600',
      accentHover: 'bg-indigo-700',
      success: 'text-green-600',
      successBg: 'bg-green-50',
      warning: 'text-yellow-600',
      warningBg: 'bg-yellow-50',
      error: 'text-red-600',
      errorBg: 'bg-red-50',
      scrollbar: 'scrollbar-thumb-gray-300',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    }
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('synesthetica_theme');
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('synesthetica_theme', theme);
  }, [theme]);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];
    
    // Remove all theme classes
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add(`theme-${theme}`);
    
    // Update CSS custom properties for dynamic theming
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    currentTheme: themes[theme],
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
