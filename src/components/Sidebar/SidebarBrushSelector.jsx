import { Circle, Square, Wind, Star, Plus, Triangle, Zap, Waves } from 'lucide-react';
import { BRUSHES } from '@/constants/brushes';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState } from 'react';
import { UpgradeModal } from '@/components/UpgradeModal';

// Enhanced brush definitions with waveform mappings
const ENHANCED_BRUSHES = {
  round: { 
    ...BRUSHES.round,
    icon: Circle, 
    label: "Round", 
    wave: "sine",
    description: "Pure tone - Flute-like smooth sound",
    timbre: "Clean, pure sine wave with no harmonics"
  },
  square: { 
    ...BRUSHES.square,
    icon: Square, 
    label: "Square", 
    wave: "square",
    description: "Harsh Digital - Retro 8-bit",
    timbre: "Bright, buzzy square wave with odd harmonics"
  },
  spray: { 
    ...BRUSHES.spray,
    icon: Wind, 
    label: "Spray", 
    wave: "fm",
    description: "Warbled - Frequency Modulation",
    timbre: "5Hz LFO modulating pitch ±40Hz on base sine"
  },
  star: { 
    ...BRUSHES.star,
    icon: Star, 
    label: "Star", 
    wave: "additive",
    description: "Rich Harmonic - Additive synthesis",
    timbre: "Base freq + second harmonic (2× freq, 0.5 amplitude)"
  },
  cross: { 
    ...BRUSHES.cross,
    icon: Plus, 
    label: "Cross", 
    wave: "detuned",
    description: "Movement - Detuned Beating",
    timbre: "Base freq + detuned +20Hz, 0.3 amplitude"
  },
  triangle: { 
    ...BRUSHES.triangle,
    icon: Triangle, 
    label: "Triangle", 
    wave: "triangle",
    description: "Soft Mellow - Clarinet-like",
    timbre: "Gentle triangle wave with fewer harmonics"
  },
  sawtooth: { 
    icon: Waves, 
    label: "Sawtooth", 
    wave: "sawtooth",
    description: "Bright Buzzy - Brassy synth",
    timbre: "Rich harmonics, bright and cutting tone"
  },
};

export function SidebarBrushSelector({ brushType, onBrushTypeChange, brushSize, onBrushSizeChange }) {
  const { canUseBrush, proBrushes } = useSubscription();
  const [upgradeModal, setUpgradeModal] = useState({ isOpen: false, type: 'brush' });

  const handleBrushClick = (key) => {
    if (canUseBrush(key)) {
      onBrushTypeChange(key);
    } else {
      setUpgradeModal({ isOpen: true, type: 'brush' });
    }
  };

  const isProBrush = (key) => proBrushes.includes(key);

  return (
    <>
      <div className="space-y-4">
        {/* Brush Grid */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(ENHANCED_BRUSHES).map(([key, brush]) => {
            const Icon = brush.icon;
            const isSelected = brushType === key;
            const isLocked = !canUseBrush(key);
            const isPro = isProBrush(key);
            
            return (
              <button
                key={key}
                onClick={() => handleBrushClick(key)}
                disabled={isLocked}
                className={`relative p-3 rounded-xl border transition-all duration-200 group ${
                  isSelected
                    ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/20"
                    : isLocked
                    ? "bg-white/5 border-white/10 cursor-not-allowed opacity-60"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-md"
                }`}
                title={isLocked ? `${brush.label} (Pro only)` : brush.description}
              >
                {/* Pro Badge */}
                {isPro && (
                  <div className="absolute top-2 right-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-bold text-black">P</span>
                    </div>
                  </div>
                )}

                {/* Lock Icon */}
                {isLocked && (
                  <div className="absolute top-2 left-2">
                    <div className="w-4 h-4 bg-red-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                    </div>
                  </div>
                )}

                {/* Brush Icon */}
                <div className={`flex justify-center mb-2 ${
                  isLocked ? 'text-gray-500' : isSelected ? 'text-indigo-400' : 'text-white/60 group-hover:text-white/80'
                }`}>
                  <Icon size={24} />
                </div>

                {/* Brush Name */}
                <div className="text-center">
                  <h4 className={`text-xs font-medium ${
                    isLocked ? 'text-gray-500' : isSelected ? 'text-indigo-300' : 'text-white/70 group-hover:text-white/90'
                  }`}>
                    {brush.label}
                  </h4>
                  <p className={`text-[9px] mt-1 ${
                    isLocked ? 'text-gray-600' : 'text-white/40'
                  }`}>
                    {brush.wave}
                  </p>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-1 bg-indigo-400 rounded-full" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Brush Size Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Brush Size
            </label>
            <span className="text-xs text-white/40 font-mono">{brushSize}px</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="4"
              max="64"
              value={brushSize}
              onChange={onBrushSizeChange}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((brushSize - 4) / 60) * 100}%, rgba(255,255,255,0.1) ${((brushSize - 4) / 60) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <div className="flex justify-between text-[9px] text-white/30 mt-1">
              <span>4px</span>
              <span>64px</span>
            </div>
          </div>
        </div>

        {/* Current Brush Info */}
        <div className="p-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            {(() => {
              const Icon = ENHANCED_BRUSHES[brushType]?.icon || Circle;
              return <Icon size={16} className="text-indigo-400" />;
            })()}
            <h4 className="text-sm font-medium text-white/80">
              {ENHANCED_BRUSHES[brushType]?.label || 'Unknown'}
            </h4>
          </div>
          <p className="text-xs text-white/60 mb-2">
            {ENHANCED_BRUSHES[brushType]?.description || 'No description'}
          </p>
          <div className="text-[10px] text-white/40 font-mono bg-black/20 rounded px-2 py-1">
            Waveform: {ENHANCED_BRUSHES[brushType]?.wave || 'unknown'}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #6366f1;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #6366f1;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ isOpen: false, type: 'brush' })}
        type={upgradeModal.type}
      />
    </>
  );
}
