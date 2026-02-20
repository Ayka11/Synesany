import React from 'react';
import * as Icons from 'lucide-react';

export const SonificationModePanel = ({ 
  sonificationMode,
  onSonificationModeChange,
  className = ''
}) => {
  const sonificationModes = [
    { 
      id: 'simple', 
      name: 'Simple', 
      description: 'Basic tone mapping',
      icon: Icons.Zap,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'timeline', 
      name: 'Timeline', 
      description: 'Time-based playback',
      icon: Icons.Clock,
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'colorfield', 
      name: 'Color Field', 
      description: 'Spatial audio mapping',
      icon: Icons.Layers,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'harmonic', 
      name: 'Harmonic', 
      description: 'Multi-tone harmony',
      icon: Icons.Settings,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className={`fixed top-20 right-4 z-30 ${className}`}>
      <div className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl p-4 min-w-[200px]">
        <div className="flex items-center gap-2 mb-3">
          <Icons.Settings size={16} className="text-white/60" />
          <h3 className="text-sm font-semibold text-white/80">Sonification Mode</h3>
        </div>
        
        <div className="space-y-2">
          {sonificationModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSonificationModeChange?.(mode.id)}
              className={`
                w-full p-3 text-left rounded-lg border transition-all text-xs
                ${sonificationMode === mode.id
                  ? `bg-gradient-to-r ${mode.color} border-transparent text-white shadow-lg`
                  : 'border-white/10 hover:border-white/20 bg-white/5 text-white/60 hover:text-white/80'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <mode.icon size={14} />
                <div>
                  <div className="font-medium">{mode.name}</div>
                  <div className="text-[10px] opacity-75">{mode.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
