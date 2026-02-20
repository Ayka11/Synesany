import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, availableLanguages, currentLanguage } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const currentLang = availableLanguages.find(lang => lang.code === language);

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
          }`}
        >
          <Globe size={16} />
          <span className="text-sm font-medium">{currentLang.flag}</span>
        </button>
        
        {isOpen && (
          <div className={`absolute top-full right-0 mt-2 w-48 rounded-lg border shadow-lg z-50 ${
            theme === 'dark' 
              ? 'bg-gray-900 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="py-1">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  } ${language === lang.code ? (theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900') : ''}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
          theme === 'dark' 
            ? 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200'
        }`}
      >
        <Globe size={18} />
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLang.flag}</span>
          <span className="text-sm font-medium">{currentLang.name}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-64 rounded-lg border shadow-lg z-50 ${
          theme === 'dark' 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="py-2">
            <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Select Language / Dil Seçin / انتخاب اللغة
            </div>
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                } ${language === lang.code ? (theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900') : ''}`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{lang.name}</div>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {lang.code === 'en' && 'English'}
                    {lang.code === 'az' && 'Azərbaycanca'}
                    {lang.code === 'ru' && 'Русский'}
                    {lang.code === 'tr' && 'Türkçe'}
                    {lang.code === 'ar' && 'العربية'}
                    {lang.code === 'zh' && '中文'}
                  </div>
                </div>
                {language === lang.code && (
                  <div className={`w-2 h-2 rounded-full ${
                    theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-600'
                  }`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
