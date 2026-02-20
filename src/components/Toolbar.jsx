import React, { useState, useRef, useEffect } from 'react';
import { useToolbarStore, BRUSHES, COLOR_PALETTES, NOTE_PALETTES, getFrequencyFromColor, getNoteFromFrequency } from '../stores/toolbarStore';

const Toolbar = ({ onColorChange, onBrushChange, onClearCanvas, onSoundToggle, onSonificationModeChange }) => {
  const {
    sidebarOpen,
    currentColor,
    selectedBrush,
    brushSize,
    soundEnabled,
    volume,
    sonificationMode,
    favoritePalettes,
    expandedSections,
    setSidebarOpen,
    setCurrentColor,
    setSelectedBrush,
    setBrushSize,
    setSoundEnabled,
    setVolume,
    setSonificationMode,
    toggleFavoritePalette,
    toggleSection,
  } = useToolbarStore();

  const audioContextRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play tone preview
  const playTonePreview = (frequency, duration = 0.2) => {
    if (!audioContextRef.current || !soundEnabled) return;

    const now = audioContextRef.current.currentTime;
    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    gain.gain.setValueAtTime(volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);

    osc.start(now);
    osc.stop(now + duration);
  };

  // Handle color change with tone preview
  const handleColorChange = (color) => {
    setCurrentColor(color);
    onColorChange?.(color);
    if (soundEnabled) {
      const frequency = getFrequencyFromColor(color);
      playTonePreview(frequency);
    }
  };

  // Handle palette color selection
  const handlePaletteColorClick = (color, paletteName) => {
    handleColorChange(color);
    setActivePalette(paletteName);
  };

  // Handle brush selection
  const handleBrushSelect = (brushId) => {
    setSelectedBrush(brushId);
    onBrushChange?.(brushId);
  };

  // Render section header
  const SectionHeader = ({ title, sectionKey, icon }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span>{title}</span>
      </div>
      <svg
        className={`w-4 h-4 transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-80' : 'w-16'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-4 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-colors z-50"
      >
        {sidebarOpen ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="h-full overflow-y-auto p-4">
        {/* Logo/Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Synesthetica</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Color to Sound</p>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <>
            {/* Color Section */}
            <div className="mb-6">
              <SectionHeader title="Color" sectionKey="color" icon="🎨" />
              {expandedSections.color && (
                <div className="mt-3 space-y-4">
                  {/* Active Color Preview */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                      style={{ backgroundColor: currentColor }}
                    />
                    <div className="flex-1">
                      <div className="font-mono text-sm text-gray-900 dark:text-white">
                        {currentColor.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getNoteFromFrequency(getFrequencyFromColor(currentColor))} • {Math.round(getFrequencyFromColor(currentColor))}Hz
                      </div>
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Color Picker
                    </label>
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
                    />
                  </div>

                  {/* Quick Colors */}
                  <div className="grid grid-cols-8 gap-2">
                    {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Palettes Section */}
            <div className="mb-6">
              <SectionHeader title="Palettes" sectionKey="palettes" icon="🎭" />
              {expandedSections.palettes && (
                <div className="mt-3 space-y-3">
                  {/* Notes section temporarily removed to avoid crash */}
                  
                  {Object.entries(COLOR_PALETTES).map(([name, palette]) => (
                    <div
                      key={name}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {palette.description}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleFavoritePalette(name)}
                          className={`p-1 rounded ${
                            favoritePalettes.includes(name)
                              ? 'text-yellow-500'
                              : 'text-gray-400 hover:text-yellow-500'
                          } transition-colors`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex gap-2">
                        {palette.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handlePaletteColorClick(color, name)}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Brushes Section */}
            <div className="mb-6">
              <SectionHeader title="Brushes" sectionKey="brushes" icon="🖌️" />
              {expandedSections.brushes && (
                <div className="mt-3">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Object.values(BRUSHES).map((brush) => (
                      <button
                        key={brush.id}
                        onClick={() => handleBrushSelect(brush.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedBrush === brush.id
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="text-2xl mb-1">{brush.icon}</div>
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          {brush.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {brush.timbre}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Brush Size */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Brush Size
                      </label>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {brushSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions Section */}
            <div className="mb-6">
              <SectionHeader title="Actions" sectionKey="actions" icon="⚙️" />
              {expandedSections.actions && (
                <div className="mt-3 space-y-2">
                  {/* Sound Toggle */}
                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      onSoundToggle?.(!soundEnabled);
                    }}
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

                  {/* Volume */}
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

                  {/* Sonification Mode */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Sonification Mode
                    </label>
                    <div className="grid grid-cols-1 gap-1">
                      {['simple', 'timeline', 'colorfield'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setSonificationMode(mode);
                            onSonificationModeChange?.(mode);
                          }}
                          className={`p-2 text-xs rounded-lg border transition-all capitalize ${
                            sonificationMode === mode
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          {mode === 'simple' && '🎹 Simple'}
                          {mode === 'timeline' && '🎵 Timeline'}
                          {mode === 'colorfield' && '⚡ Color Field'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Canvas */}
                  <button
                    onClick={onClearCanvas}
                    className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                  >
                    🗑️ Clear Canvas
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
