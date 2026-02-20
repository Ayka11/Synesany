import React from 'react';
import { useToolbarStore, COLOR_PALETTES, getFrequencyFromColor } from '../stores/toolbarStore';

const PaletteGrid = ({ onColorSelect, compact = false }) => {
  const { favoritePalettes, toggleFavoritePalette, currentColor } = useToolbarStore();

  // Sort palettes: favorites first, then alphabetically
  const sortedPalettes = Object.entries(COLOR_PALETTES).sort(([a], [b]) => {
    const aFav = favoritePalettes.includes(a);
    const bFav = favoritePalettes.includes(b);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.localeCompare(b);
  });

  const handleColorClick = (color, paletteName) => {
    onColorSelect?.(color, paletteName);
  };

  if (compact) {
    // Compact version for collapsed sidebar or mobile
    return (
      <div className="grid grid-cols-2 gap-2">
        {sortedPalettes.slice(0, 4).map(([name, palette]) => (
          <div key={name} className="space-y-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleFavoritePalette(name)}
                className={`p-0.5 rounded ${
                  favoritePalettes.includes(name)
                    ? 'text-yellow-500'
                    : 'text-gray-400 hover:text-yellow-500'
                } transition-colors`}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {name}
              </span>
            </div>
            <div className="flex gap-1">
              {palette.colors.slice(0, 4).map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorClick(color, name)}
                  className={`w-4 h-4 rounded-full border border-white shadow-sm hover:scale-110 transition-transform ${
                    currentColor === color ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Full version for expanded sidebar
  return (
    <div className="space-y-3">
      {sortedPalettes.map(([name, palette]) => (
        <div
          key={name}
          className="group p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {name}
                </h3>
                {favoritePalettes.includes(name) && (
                  <span className="text-xs text-yellow-500">⭐</span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {palette.description}
              </p>
            </div>
            <button
              onClick={() => toggleFavoritePalette(name)}
              className={`p-1.5 rounded-lg transition-all ${
                favoritePalettes.includes(name)
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
              title={favoritePalettes.includes(name) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          </div>
          
          {/* Color Swatches */}
          <div className="flex flex-wrap gap-2">
            {palette.colors.map((color, index) => (
              <button
                key={color}
                onClick={() => handleColorClick(color, name)}
                className={`relative group/color-swatch transition-all duration-200 ${
                  currentColor === color ? 'scale-110' : 'hover:scale-105'
                }`}
                title={`${color} • ${Math.round(getFrequencyFromColor(color))}Hz`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 border-white shadow-sm ${
                    currentColor === color ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
                {/* Play icon on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color-swatch:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold drop-shadow-lg">♪</span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex gap-1">
              {palette.colors.slice(0, 3).map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorClick(color, name)}
                  className="w-6 h-6 rounded-full border border-white shadow-sm hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button
              onClick={() => {
                // Select first color of palette
                handleColorClick(palette.colors[0], name);
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              Use Palette
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaletteGrid;
