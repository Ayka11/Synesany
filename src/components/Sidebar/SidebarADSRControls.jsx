import { Activity, Zap, Volume2, Layers, Music2 } from 'lucide-react';

export function SidebarADSRControls({
  attack,
  onAttackChange,
  decay,
  onDecayChange,
  sustain,
  onSustainChange,
  release,
  onReleaseChange,
  sonificationMode,
  onSonificationModeChange,
}) {
  const envelopeParams = [
    {
      name: 'Attack',
      value: attack,
      onChange: onAttackChange,
      min: 0,
      max: 2,
      step: 0.01,
      unit: 's',
      description: 'Fade in time',
      icon: Zap,
      color: 'from-green-400 to-emerald-400'
    },
    {
      name: 'Decay',
      value: decay,
      onChange: onDecayChange,
      min: 0,
      max: 2,
      step: 0.01,
      unit: 's',
      description: 'Initial fade out',
      icon: Activity,
      color: 'from-yellow-400 to-orange-400'
    },
    {
      name: 'Sustain',
      value: sustain,
      onChange: onSustainChange,
      min: 0,
      max: 1,
      step: 0.01,
      unit: '',
      description: 'Hold level',
      icon: Volume2,
      color: 'from-blue-400 to-indigo-400'
    },
    {
      name: 'Release',
      value: release,
      onChange: onReleaseChange,
      min: 0,
      max: 2,
      step: 0.01,
      unit: 's',
      description: 'Fade out time',
      icon: Activity,
      color: 'from-purple-400 to-pink-400'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Sonification Mode Toggle */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
          Sonification Mode
        </h3>
        
        <div className="relative">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                sonificationMode === 'timeline' 
                  ? 'bg-gradient-to-br from-blue-400 to-cyan-400' 
                  : 'bg-gradient-to-br from-purple-400 to-pink-400'
              }`}>
                {sonificationMode === 'timeline' ? (
                  <Music2 size={16} className="text-white" />
                ) : (
                  <Layers size={16} className="text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="text-sm font-medium text-white/80">
                  {sonificationMode === 'timeline' ? 'Timeline Mode' : 'Color Harmony Mode'}
                </div>
                <div className="text-xs text-white/40">
                  {sonificationMode === 'timeline' 
                    ? 'Position → Time progression' 
                    : 'Pure color texture, no position dependency'
                  }
                </div>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button
              onClick={() => onSonificationModeChange(sonificationMode === 'timeline' ? 'colorfield' : 'timeline')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                sonificationMode === 'timeline' 
                  ? 'bg-blue-500' 
                  : 'bg-purple-500'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  sonificationMode === 'timeline' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
        Sound Envelope (ADSR)
      </h3>

      {/* ADSR Visualization */}
      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40">Envelope Shape</span>
          <div className="flex gap-1">
            {['A', 'D', 'S', 'R'].map((phase, idx) => (
              <div
                key={phase}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white bg-gradient-to-br ${
                  phase === 'A' ? 'from-green-400 to-emerald-400' :
                  phase === 'D' ? 'from-yellow-400 to-orange-400' :
                  phase === 'S' ? 'from-blue-400 to-indigo-400' :
                  'from-purple-400 to-pink-400'
                }`}
              >
                {phase}
              </div>
            ))}
          </div>
        </div>
        
        {/* Simple envelope visualization */}
        <div className="h-12 bg-black/30 rounded-lg relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 200 50">
            <path
              d={`M 10,40 
                      L ${10 + attack * 50},10 
                      L ${10 + attack * 50 + decay * 30},${10 + (1 - sustain) * 30} 
                      L ${10 + attack * 50 + decay * 30 + 50},${10 + (1 - sustain) * 30} 
                      L ${10 + attack * 50 + decay * 30 + 50 + release * 40},40`}
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="33%" stopColor="#eab308" />
                <stop offset="66%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* ADSR Controls */}
      <div className="space-y-3">
        {envelopeParams.map((param) => {
          const Icon = param.icon;
          const percentage = ((param.value - param.min) / (param.max - param.min)) * 100;
          
          return (
            <div key={param.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${param.color} flex items-center justify-center`}>
                    <Icon size={12} className="text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-white/80">{param.name}</span>
                    <span className="text-xs text-white/40 ml-1">{param.description}</span>
                  </div>
                </div>
                <span className="text-xs text-white/40 font-mono">
                  {param.value.toFixed(2)}{param.unit}
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={param.onChange}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${param.color.replace('from-', '#').replace(' to-', ',')} 0%, ${param.color.replace('from-', '#').replace(' to-', ',')} ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-white/60">Quick Presets</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onAttackChange({ target: { value: 0.01 } });
              onDecayChange({ target: { value: 0.1 } });
              onSustainChange({ target: { value: 0.7 } });
              onReleaseChange({ target: { value: 0.3 } });
            }}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs text-white/70 hover:text-white/90"
          >
            Plucky
          </button>
          <button
            onClick={() => {
              onAttackChange({ target: { value: 0.5 } });
              onDecayChange({ target: { value: 0.2 } });
              onSustainChange({ target: { value: 0.6 } });
              onReleaseChange({ target: { value: 1.0 } });
            }}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs text-white/70 hover:text-white/90"
          >
            Smooth
          </button>
          <button
            onClick={() => {
              onAttackChange({ target: { value: 0.02 } });
              onDecayChange({ target: { value: 0.05 } });
              onSustainChange({ target: { value: 0.8 } });
              onReleaseChange({ target: { value: 0.1 } });
            }}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs text-white/70 hover:text-white/90"
          >
            Percussive
          </button>
          <button
            onClick={() => {
              onAttackChange({ target: { value: 2.0 } });
              onDecayChange({ target: { value: 0.5 } });
              onSustainChange({ target: { value: 0.4 } });
              onReleaseChange({ target: { value: 1.5 } });
            }}
            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-xs text-white/70 hover:text-white/90"
          >
            Ambient
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
