import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const isDark = theme === 'dark';
  const currentTheme = isDark ? 'dark' : 'light';

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        className={`relative p-2 rounded-lg transition-all duration-300 ${
          isDark 
            ? 'bg-white/10 hover:bg-white/20 text-yellow-400 hover:text-yellow-300' 
            : 'bg-gray-100 hover:bg-gray-200 text-orange-500 hover:text-orange-600'
        } ${isAnimating ? 'scale-110' : 'scale-100'}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      >
        <div className={`transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </div>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-2 text-sm ${
        isDark ? 'text-white/60' : 'text-gray-600'
      }`}>
        <Sun size={16} className={isDark ? 'text-gray-400' : 'text-orange-500'} />
        <span>{isDark ? 'Night' : 'Day'}</span>
        <Moon size={16} className={isDark ? 'text-yellow-400' : 'text-gray-400'} />
      </div>
      
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
            : 'bg-gradient-to-r from-blue-400 to-purple-400'
        } ${isAnimating ? 'scale-105' : 'scale-100'}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            isDark ? 'translate-x-7' : 'translate-x-1'
          } ${isAnimating ? 'scale-110' : 'scale-100'}`}
        >
          <div className={`flex items-center justify-center h-full transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}>
            {isDark ? <Moon size={12} className="text-gray-700" /> : <Sun size={12} className="text-gray-700" />}
          </div>
        </span>
      </button>
    </div>
  );
}
