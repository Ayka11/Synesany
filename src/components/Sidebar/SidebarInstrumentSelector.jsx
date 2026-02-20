import { Piano, Guitar, Music, Bell, Waves } from 'lucide-react';
import { INSTRUMENTS } from '@/constants/instruments';

// Enhanced instrument definitions with icons
const ENHANCED_INSTRUMENTS = {
  sine: { 
    ...INSTRUMENTS.sine,
    icon: Waves,
    color: 'from-blue-400 to-cyan-400'
  },
  triangle: { 
    ...INSTRUMENTS.triangle,
    icon: Waves,
    color: 'from-green-400 to-emerald-400'
  },
  sawtooth: { 
    ...INSTRUMENTS.sawtooth,
    icon: Waves,
    color: 'from-orange-400 to-red-400'
  },
  square: { 
    ...INSTRUMENTS.square,
    icon: Waves,
    color: 'from-purple-400 to-pink-400'
  },
  piano: { 
    ...INSTRUMENTS.piano,
    icon: Piano,
    color: 'from-indigo-400 to-blue-400'
  },
  guitar: { 
    ...INSTRUMENTS.guitar,
    icon: Guitar,
    color: 'from-yellow-400 to-orange-400'
  },
  strings: { 
    ...INSTRUMENTS.strings,
    icon: Music,
    color: 'from-rose-400 to-pink-400'
  },
  bell: { 
    ...INSTRUMENTS.bell,
    icon: Bell,
    color: 'from-amber-400 to-yellow-400'
  },
};

export function SidebarInstrumentSelector({ instrument, onInstrumentChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
        Instruments
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(ENHANCED_INSTRUMENTS).map(([key, inst]) => {
          const Icon = inst.icon;
          const isSelected = instrument === key;
          
          return (
            <button
              key={key}
              onClick={() => onInstrumentChange({ target: { value: key } })}
              className={`relative p-3 rounded-lg border transition-all duration-200 group ${
                isSelected
                  ? `bg-gradient-to-br ${inst.color} border-white/30 shadow-lg`
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              {/* Instrument Icon */}
              <div className={`flex justify-center mb-2 ${
                isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/80'
              }`}>
                <Icon size={20} />
              </div>

              {/* Instrument Name */}
              <div className="text-center">
                <h4 className={`text-xs font-medium ${
                  isSelected ? 'text-white' : 'text-white/70 group-hover:text-white/90'
                }`}>
                  {inst.label}
                </h4>
                <p className={`text-[9px] mt-0.5 ${
                  isSelected ? 'text-white/80' : 'text-white/40'
                }`}>
                  {inst.description}
                </p>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Instrument Info */}
      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          {(() => {
            const Icon = ENHANCED_INSTRUMENTS[instrument]?.icon || Waves;
            return <Icon size={16} className="text-white/60" />;
          })()}
          <div>
            <h4 className="text-sm font-medium text-white/80">
              {ENHANCED_INSTRUMENTS[instrument]?.label || 'Unknown'}
            </h4>
            <p className="text-xs text-white/40">
              {ENHANCED_INSTRUMENTS[instrument]?.description || 'No description'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
