import React, { useState } from 'react';
import { useToolbarStore } from '../stores/toolbarStore';

const ActionsPanel = ({ onClearCanvas, onSoundToggle, onSonificationModeChange, compact = false }) => {
  const {
    soundEnabled,
    volume,
    sonificationMode,
    setSoundEnabled,
    setVolume,
    setSonificationMode,
  } = useToolbarStore();

  const [isUndoAvailable, setIsUndoAvailable] = useState(false);
  const [isRedoAvailable, setIsRedoAvailable] = useState(false);

  const handleSoundToggle = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    onSoundToggle?.(newState);
  };

  const handleSonificationModeChange = (mode) => {
    setSonificationMode(mode);
    onSonificationModeChange?.(mode);
  };

  const handleUndo = () => {
    // TODO: Implement undo functionality
    console.log('Undo action');
  };

  const handleRedo = () => {
    // TODO: Implement redo functionality
    console.log('Redo action');
  };

  if (compact) {
    // Compact version for collapsed sidebar
    return (
      <div className="space-y-2">
        {/* Sound Toggle */}
        <button
          onClick={handleSoundToggle}
          className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-center ${
            soundEnabled
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
          title={soundEnabled ? 'Sound On' : 'Sound Off'}
        >
          <span className="text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
        </button>

        {/* Clear Canvas */}
        <button
          onClick={onClearCanvas}
          className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          title="Clear Canvas"
        >
          <span className="text-lg">🗑️</span>
        </button>
      </div>
    );
  }

  // Full version for expanded sidebar
  return (
    <div className="space-y-4">
      {/* Sound Controls */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sound</h3>
        
        {/* Sound Toggle */}
        <button
          onClick={handleSoundToggle}
          className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
            soundEnabled
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
        >
          <span className="text-sm font-medium">
            {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
          </span>
          <div className={`w-12 h-6 rounded-full transition-colors ${
            soundEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}>
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </div>
        </button>

        {/* Volume Control */}
        {soundEnabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Volume
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Sonification Mode */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sonification Mode</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'simple', name: 'Simple Mode', icon: '🎹', description: 'Fixed chord progression' },
            { id: 'timeline', name: 'Timeline', icon: '🎵', description: 'Sequential pixel scan' },
            { id: 'colorfield', name: 'Color Field', icon: '⚡', description: 'Spatial color mapping' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleSonificationModeChange(mode.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                sonificationMode === mode.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{mode.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {mode.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {mode.description}
                  </div>
                </div>
                {sonificationMode === mode.id && (
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Canvas Actions</h3>
        
        {/* Undo/Redo */}
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!isUndoAvailable}
            className={`flex-1 p-2 rounded-lg border-2 transition-all flex items-center justify-center ${
              isUndoAvailable
                ? 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer'
                : 'border-gray-100 dark:border-gray-700 cursor-not-allowed opacity-50'
            }`}
            title="Undo"
          >
            <span className="text-sm">↶</span>
          </button>
          <button
            onClick={handleRedo}
            disabled={!isRedoAvailable}
            className={`flex-1 p-2 rounded-lg border-2 transition-all flex items-center justify-center ${
              isRedoAvailable
                ? 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer'
                : 'border-gray-100 dark:border-gray-700 cursor-not-allowed opacity-50'
            }`}
            title="Redo"
          >
            <span className="text-sm">↷</span>
          </button>
        </div>

        {/* Clear Canvas */}
        <button
          onClick={onClearCanvas}
          className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
        >
          <span>🗑️</span>
          <span>Clear Canvas</span>
        </button>

        {/* Export/Save */}
        <div className="grid grid-cols-2 gap-2">
          <button
            className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all text-xs font-medium text-gray-700 dark:text-gray-300"
            title="Export as Image"
          >
            📷 Export
          </button>
          <button
            className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all text-xs font-medium text-gray-700 dark:text-gray-300"
            title="Save Project"
          >
            💾 Save
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Shortcuts</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Clear Canvas</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+D</kbd>
          </div>
          <div className="flex justify-between">
            <span>Toggle Sound</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">S</kbd>
          </div>
          <div className="flex justify-between">
            <span>Undo</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Z</kbd>
          </div>
          <div className="flex justify-between">
            <span>Redo</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Y</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionsPanel;
