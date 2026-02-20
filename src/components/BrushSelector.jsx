import React from 'react';
import { useToolbarStore, BRUSHES } from '../stores/toolbarStore';

const BrushSelector = ({ compact = false }) => {
  const { selectedBrush, brushSize, setSelectedBrush, setBrushSize } = useToolbarStore();

  const handleBrushSelect = (brushId) => {
    setSelectedBrush(brushId);
  };

  if (compact) {
    // Compact version for collapsed sidebar
    return (
      <div className="grid grid-cols-2 gap-2">
        {Object.values(BRUSHES).slice(0, 4).map((brush) => (
          <button
            key={brush.id}
            onClick={() => handleBrushSelect(brush.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedBrush === brush.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
            title={`${brush.name} - ${brush.description}`}
          >
            <div className="text-xl">{brush.icon}</div>
          </button>
        ))}
      </div>
    );
  }

  // Full version for expanded sidebar
  return (
    <div className="space-y-4">
      {/* Brush Grid */}
      <div className="grid grid-cols-3 gap-2">
        {Object.values(BRUSHES).map((brush) => (
          <button
            key={brush.id}
            onClick={() => handleBrushSelect(brush.id)}
            className={`group relative p-3 rounded-lg border-2 transition-all duration-200 ${
              selectedBrush === brush.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
            }`}
          >
            {/* Brush Icon */}
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
              {brush.icon}
            </div>
            
            {/* Brush Name */}
            <div className="text-xs font-medium text-gray-900 dark:text-white">
              {brush.name}
            </div>
            
            {/* Timbre */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {brush.timbre}
            </div>

            {/* Selection Indicator */}
            {selectedBrush === brush.id && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Brush Size Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Brush Size
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3ch] text-right">
              {brushSize}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">px</span>
          </div>
        </div>
        
        {/* Size Slider */}
        <div className="relative">
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          
          {/* Size Preview */}
          <div className="flex justify-between mt-2 px-1">
            {[1, 10, 20, 30, 40, 50].map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  brushSize === size
                    ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                style={{
                  width: `${Math.max(6, size / 3)}px`,
                  height: `${Math.max(6, size / 3)}px`,
                }}
                title={`${size}px`}
              />
            ))}
          </div>
        </div>

        {/* Brush Preview */}
        <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="relative">
            <div
              className="rounded-full bg-current"
              style={{
                width: `${brushSize}px`,
                height: `${brushSize}px`,
                backgroundColor: '#4f46e5',
              }}
            />
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {BRUSHES[selectedBrush].name} • {brushSize}px
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrushSelector;
