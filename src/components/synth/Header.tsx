import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from '@/lib/i18n';
import { useAppContext } from '@/contexts/AppContext';
import { LANGUAGES, Language } from '@/data/translations';
import {
  Sun, Moon, Volume2, VolumeX, Globe, Menu,
  ChevronDown, Paintbrush, X, User, LogOut,
  LayoutDashboard, Loader2, Mail, Lock, Eye, EyeOff
} from 'lucide-react';

/* ─── Auth Modal ─── */
const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, signIn, signUp, authLoading } = useAppContext();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const err = mode === 'signin'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);
    if (err) setError(err);
  };

  const reset = () => { setEmail(''); setPassword(''); setError(null); };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setAuthModalOpen(false); reset(); }} />
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Gradient header */}
        <div className="h-24 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 flex items-center justify-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Paintbrush className="w-7 h-7 text-white" />
          </div>
          <button
            onClick={() => { setAuthModalOpen(false); reset(); }}
            className="absolute top-3 right-3 p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex bg-accent/50 rounded-xl p-1 mb-5">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'signin' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'signup' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="text-xs text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-[10px] text-muted-foreground text-center mt-4">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
              className="text-primary font-medium hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── User Avatar Dropdown ─── */
const UserDropdown: React.FC = () => {
  const { user, profile, signOut } = useAppContext();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = (profile?.display_name || user.email || '?')
    .split(/[\s@]/)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase() || '')
    .join('');

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold hover:ring-2 hover:ring-primary/30 transition-all"
        title={profile?.display_name || user.email}
      >
        {initials}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-popover border border-border rounded-xl shadow-2xl z-50 py-2 min-w-[200px]">
            {/* User info */}
            <div className="px-3 pb-2 mb-1 border-b border-border/50">
              <div className="text-xs font-semibold truncate">{profile?.display_name || 'User'}</div>
              <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
            </div>

            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> My Gallery
            </Link>

            <button
              onClick={() => { signOut(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Header ─── */
const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const { volume, setVolume, muted, setMuted, toggleSidebar, user, setAuthModalOpen } = useAppContext();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/pricing', label: t('nav.pricing') },
    { path: '/help', label: t('nav.help') },
    { path: '/dashboard', label: t('nav.dashboard') },
  ];

  const isDark = theme === 'dark';

  return (
    <>
      <header className="h-12 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-3 md:px-4 gap-2 z-50 relative">
        {/* Left: Mobile menu toggle */}
        <button
          onClick={() => {
            if (location.pathname === '/') toggleSidebar();
            else setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors md:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        <Link to="/" className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Paintbrush className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight hidden sm:inline bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
            {t('app.name')}
          </span>
        </Link>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          {/* Volume pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-accent/50 rounded-full px-2 py-1">
            <button onClick={() => setMuted(!muted)} className="p-0.5 rounded-full hover:bg-accent transition-colors">
              {muted ? <VolumeX className="w-3.5 h-3.5 text-muted-foreground" /> : <Volume2 className="w-3.5 h-3.5 text-foreground" />}
            </button>
            <input
              type="range" min="0" max="1" step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); if (v > 0 && muted) setMuted(false); }}
              className="w-16 h-1 accent-primary cursor-pointer"
            />
          </div>

          {/* Language selector */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:bg-accent transition-colors">
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-xl z-50 py-1 min-w-[140px]">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code as Language); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-accent transition-colors flex items-center gap-2 ${
                        language === lang.code ? 'text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      <span className="font-mono text-[10px] bg-accent rounded px-1">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-1.5 rounded-lg hover:bg-accent transition-all"
            title={isDark ? t('theme.light') : t('theme.dark')}
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Auth: Avatar or Sign In button */}
          {user ? (
            <UserDropdown />
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile navigation overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 w-64 h-full bg-background border-r border-border shadow-2xl p-4 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 flex items-center justify-center">
                  <Paintbrush className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                  {t('app.name')}
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-accent">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal />
    </>
  );
};

export default Header;
