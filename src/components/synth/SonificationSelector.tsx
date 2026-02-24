import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { SonificationMode } from '@/data/pianoKeys';
import { Waves, Clock, Grid3X3, Music2, ChevronDown } from 'lucide-react';

interface ModeConfig {
  mode: SonificationMode;
  icon: React.ReactNode;
  nameKey: string;
  descKey: string;
  gradient: string;
}

const MODES: ModeConfig[] = [
  {
    mode: 'simple',
    icon: <Waves className="w-4 h-4" />,
    nameKey: 'mode.simple',
    descKey: 'mode.simple.desc',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    mode: 'timeline',
    icon: <Clock className="w-4 h-4" />,
    nameKey: 'mode.timeline',
    descKey: 'mode.timeline.desc',
    gradient: 'from-violet-500 to-purple-400',
  },
  {
    mode: 'colorfield',
    icon: <Grid3X3 className="w-4 h-4" />,
    nameKey: 'mode.colorfield',
    descKey: 'mode.colorfield.desc',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    mode: 'harmonic',
    icon: <Music2 className="w-4 h-4" />,
    nameKey: 'mode.harmonic',
    descKey: 'mode.harmonic.desc',
    gradient: 'from-orange-500 to-amber-400',
  },
];

const SonificationSelector: React.FC = () => {
  const { sonificationMode, setSonificationMode } = useAppContext();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = MODES.find(m => m.mode === sonificationMode) || MODES[0];

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg hover:shadow-xl transition-all`}
        >
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${current.gradient} flex items-center justify-center text-white`}>
            {current.icon}
          </div>
          <span className="text-xs font-semibold">{t(current.nameKey)}</span>
          <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-popover/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-40 p-2 min-w-[280px]">
              {MODES.map(mode => (
                <button
                  key={mode.mode}
                  onClick={() => {
                    setSonificationMode(mode.mode);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    sonificationMode === mode.mode
                      ? 'bg-accent'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${mode.gradient} flex items-center justify-center text-white shadow-md`}>
                    {mode.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold">{t(mode.nameKey)}</div>
                    <div className="text-[10px] text-muted-foreground">{t(mode.descKey)}</div>
                  </div>
                  {sonificationMode === mode.mode && (
                    <div className={`ml-auto w-2 h-2 rounded-full bg-gradient-to-r ${mode.gradient}`} />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SonificationSelector;
