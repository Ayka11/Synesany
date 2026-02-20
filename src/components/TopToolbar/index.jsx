import React from 'react';
import { ColorPanel } from '../ProfessionalToolbar/ColorPanel';
import { BrushPanel } from '../ProfessionalToolbar/BrushPanel';
import { SoundPanel } from '../ProfessionalToolbar/SoundPanel';
import { Sparkles, Save, Volume2, VolumeX } from 'lucide-react';

export const TopToolbar = ({ 
  user, 
  isSaving, 
  onSave, 
  volume, 
  onVolumeChange, 
  isMuted, 
  onToggleMute 
}) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-white/5 px-6 backdrop-blur-xl">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
          <Sparkles size={18} className="text-white" />
        </div>
        <h1
          className="text-xl font-bold tracking-tight text-white"
          style={{ fontFamily: "Instrument Serif, serif" }}
        >
          Synesthetica
        </h1>
      </div>

      {/* Tool Options - Color and Brush */}
      <div className="flex items-center gap-6">
        {/* Color Palette */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-white/60">Colors:</span>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <ColorPanel />
          </div>
        </div>

        {/* Brush Settings */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-white/60">Brushes:</span>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <BrushPanel />
          </div>
        </div>

        {/* Sound Controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-white/60">Sound:</span>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <SoundPanel />
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSave}
          disabled={isSaving || !user}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-20"
        >
          <Save size={14} /> {isSaving ? "Saving..." : "Save Draft"}
        </button>

        <div className="flex items-center gap-1 rounded-full bg-white/5 p-1 px-3">
          <Volume2 size={16} className="text-white/40" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
            className="w-20 accent-purple-500"
          />
          <button onClick={onToggleMute} className="ml-2 hover:text-purple-400">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
