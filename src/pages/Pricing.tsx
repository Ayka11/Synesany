import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import Header from '@/components/synth/Header';
import { Check, X, Crown, Sparkles, ArrowLeft } from 'lucide-react';

const Pricing: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    { name: '5 ' + t('pricing.feature.drawings'), free: true, pro: false },
    { name: 'Unlimited ' + t('pricing.feature.drawings'), free: false, pro: true },
    { name: t('pricing.feature.brushes'), free: true, pro: true },
    { name: t('pricing.feature.modes'), free: true, pro: true },
    { name: t('pricing.feature.export.basic'), free: true, pro: true },
    { name: t('pricing.feature.export.all'), free: false, pro: true },
    { name: t('pricing.feature.priority'), free: false, pro: true },
    { name: t('pricing.feature.gallery'), free: false, pro: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-orange-500/10" />
          <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Canvas
            </Link>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              {t('pricing.title')}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="max-w-4xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{t('pricing.free')}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t('pricing.free.desc')}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{t('pricing.free.price')}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors mb-6">
                {t('pricing.current')}
              </button>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {f.free ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className={`text-xs ${f.free ? '' : 'text-muted-foreground'}`}>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-violet-500/50 bg-card p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                POPULAR
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{t('pricing.pro')}</h3>
                  <Sparkles className="w-4 h-4 text-violet-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t('pricing.pro.desc')}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">{t('pricing.pro.price')}</span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity mb-6 shadow-lg">
                {t('pricing.upgrade')} — {t('pricing.coming')}
              </button>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {f.pro || f.free ? (
                      <div className="w-5 h-5 rounded-full bg-violet-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-violet-500" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                        <X className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-xs">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
