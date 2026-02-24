import React, { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import Header from '@/components/synth/Header';
import {
  ArrowLeft, Paintbrush, Trash2, ExternalLink,
  Image, Calendar, LogIn, Loader2, RefreshCw
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, savedDrawings, deleteDrawing, galleryLoading, loadUserDrawings, setAuthModalOpen } = useAppContext();

  // Reload drawings when page is visited and user is logged in
  useEffect(() => {
    if (user) loadUserDrawings();
  }, [user?.id]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10" />
          <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Canvas
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {t('dashboard.title')}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
              {t('dashboard.subtitle')}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-20">
          {/* Auth gate */}
          {!user ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-accent/50 flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Sign in to view your gallery</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Create an account or sign in to save your drawings to the cloud and access them from any device.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </div>
          ) : galleryLoading ? (
            <div className="text-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading your drawings...</p>
            </div>
          ) : savedDrawings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-accent/50 flex items-center justify-center mx-auto mb-4">
                <Image className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('dashboard.empty')}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t('dashboard.empty.desc')}</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                <Paintbrush className="w-4 h-4" />
                {t('dashboard.start')}
              </Link>
            </div>
          ) : (
            <>
              {/* Refresh button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={loadUserDrawings}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-accent transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedDrawings.map((drawing) => (
                  <div
                    key={drawing.id}
                    className="group rounded-2xl border border-border overflow-hidden bg-card hover:shadow-xl transition-all"
                  >
                    <div className="aspect-[4/3] bg-accent/20 overflow-hidden relative">
                      {drawing.thumbnail ? (
                        <img
                          src={drawing.thumbnail}
                          alt={drawing.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Link
                          to="/"
                          className="px-4 py-2 rounded-xl bg-white/90 text-black text-xs font-semibold shadow-lg hover:bg-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 inline mr-1.5" />
                          {t('dashboard.open')}
                        </Link>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold truncate">{drawing.name}</h3>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(drawing.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteDrawing(drawing.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
