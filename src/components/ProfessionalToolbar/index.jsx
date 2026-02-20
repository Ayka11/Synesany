import React from 'react';
import { ColorPanel } from './ColorPanel';
import { BrushPanel } from './BrushPanel';
import { ToolPanel } from './ToolPanel';
import { SoundPanel } from './SoundPanel';
import * as Icons from 'lucide-react';

export const ProfessionalToolbar = ({ 
  onColorChange, 
  currentColor,
  selectedBrush,
  onBrushChange,
  brushSize,
  onBrushSizeChange,
  soundEnabled,
  onSoundToggle,
  volume,
  onVolumeChange,
  sonificationMode,
  onSonificationModeChange,
  currentInstrument,
  onInstrumentChange,
  attack,
  onAttackChange,
  decay,
  onDecayChange,
  sustain,
  onSustainChange,
  release,
  onReleaseChange,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
  ...props 
}) => {
  const totalWidth = isCollapsed ? 64 : 396;

  return (
    <div
      className={`
        fixed left-0 top-0 h-full bg-gradient-to-b from-[#0f0f11] via-[#1a1a1e] to-[#0f0f11]
        border-r border-white/10 transition-all duration-300 z-40 shadow-2xl
        ${className}
      `}
      style={{ width: `${totalWidth}px` }}
      {...props}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-4 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 z-50"
      >
        {isCollapsed ? <Icons.GripVertical size={14} /> : <Icons.X size={14} />}
      </button>

      {/* Header */}
      {!isCollapsed && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Synesthetica</h1>
              <p className="text-xs text-white/40">Color to Sound</p>
            </div>
          </div>
        </div>
      )}

      {/* Panels Container */}
      <div className="p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        {!isCollapsed ? (
          <>
            {/* Color Panel */}
            <ColorPanel 
              onColorChange={onColorChange}
              currentColor={currentColor}
            />

            {/* Brush Panel */}
            <BrushPanel
              currentBrush={selectedBrush}
              onBrushChange={onBrushChange}
              brushSize={brushSize}
              onBrushSizeChange={onBrushSizeChange}
            />

            {/* Sound Panel */}
            <SoundPanel
              soundEnabled={soundEnabled}
              onSoundToggle={onSoundToggle}
              volume={volume}
              onVolumeChange={onVolumeChange}
              sonificationMode={sonificationMode}
              onSonificationModeChange={onSonificationModeChange}
              currentInstrument={currentInstrument}
              onInstrumentChange={onInstrumentChange}
              attack={attack}
              onAttackChange={onAttackChange}
              decay={decay}
              onDecayChange={onDecayChange}
              sustain={sustain}
              onSustainChange={onSustainChange}
              release={release}
              onReleaseChange={onReleaseChange}
            />
          </>
        ) : (
          /* Collapsed State - Icon Only */
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div className="text-xs text-white/40 text-center">Collapsed</div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-indigo-500/50 transition-colors"
          style={{ cursor: 'ew-resize' }}
        />
      )}
    </div>
  );
};

export const ToolToolbar = ({
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  onClear,
  onSave,
  onUpload,
  onDownload,
  selectedTool,
  onToolChange,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
  ...props
}) => {
  const totalWidth = isCollapsed ? 64 : 276;

  return (
    <div
      className={`
        fixed right-0 top-0 h-full bg-gradient-to-b from-[#0f0f11] via-[#1a1a1e] to-[#0f0f11]
        border-l border-white/10 transition-all duration-300 z-40 shadow-2xl
        ${className}
      `}
      style={{ width: `${totalWidth}px` }}
      {...props}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -left-3 top-4 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 z-50"
      >
        {isCollapsed ? <Icons.GripVertical size={14} /> : <Icons.X size={14} />}
      </button>

      {/* Header */}
      {!isCollapsed && (
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="font-bold text-white text-sm">Tools</h1>
              <p className="text-xs text-white/40">Canvas Actions</p>
            </div>
          </div>
        </div>
      )}

      {/* Panels Container */}
      <div className="p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        {!isCollapsed ? (
          <ToolPanel
            selectedTool={selectedTool}
            onToolChange={onToolChange}
            canUndo={canUndo}
            onUndo={onUndo}
            canRedo={canRedo}
            onRedo={onRedo}
            onClear={onClear}
            onSave={onSave}
            onUpload={onUpload}
            onDownload={onDownload}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <div className="text-xs text-white/40 text-center">Collapsed</div>
          </div>
        )}
      </div>
    </div>
  );
};
