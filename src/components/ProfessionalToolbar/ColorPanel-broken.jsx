import React, { useState, useMemo } from 'react';
import { useToolbarStore } from '../../stores/toolbarStore';
import { ColorTooltip } from '../ui/Tooltip/ColorTooltip';
import { useClipboard } from '../../hooks/useClipboard';
import { useNotifications } from '../../hooks/useNotifications.jsx';
import { RAINBOW_PALETTE, SOLAR_FLARE_PALETTE } from '../../constants/palettes';
import * as Icons from 'lucide-react';
import { ColorSelectionToast } from '../ui/Toast/ColorSelectionToast';

// ────────────────────────────────────────────────
// Extended artistic palettes to include in Solar Flare section
// ────────────────────────────────────────────────
const EXTENDED_SOLAR_PALETTES = {
  coreSolar: {
    title: "Core Solar Flare",
    colors: SOLAR_FLARE_PALETTE.data, // your original palette
  },
  ukiyoE: {
    title: "Ukiyo-e Harmony",
    colors: [
      { hex: '#2e2e38', name: 'Midnight Indigo', closestNote: 'C2' },
      { hex: '#4a6078', name: 'Steel River', closestNote: 'D3' },
      { hex: '#8a9bb5', name: 'Periwinkle Mist', closestNote: 'F4' },
      { hex: '#d9c3a5', name: 'Rice Paper', closestNote: 'A4' },
      { hex: '#e8c39e', name: 'Pale Peach Glow', closestNote: 'B4' },
      { hex: '#c94b35', name: 'Cinnabar Flame', closestNote: 'G#4' },
      { hex: '#a63f2e', name: 'Vermilion Depth', closestNote: 'F#4' },
      { hex: '#5e8c61', name: 'Pine Shadow', closestNote: 'E4' },
    ],
  },
  monetGarden: {
    title: "Monet Water Garden",
    colors: [
      { hex: '#a8d5e2', name: 'Sky Reflection', closestNote: 'A5' },
      { hex: '#7db2c7', name: 'Lily Pond Blue', closestNote: 'G4' },
      { hex: '#c7d9b0', name: 'Soft Willow Green', closestNote: 'E5' },
      { hex: '#e0c9a6', name: 'Sunlit Path', closestNote: 'B4' },
      { hex: '#f4e4bc', name: 'Golden Hour', closestNote: 'C5' },
      { hex: '#d9826b', name: 'Poppy Warmth', closestNote: 'A4' },
      { hex: '#b5654d', name: 'Earth Shadow', closestNote: 'F#4' },
      { hex: '#8b7355', name: 'Clay Brown', closestNote: 'D4' },
    ],
  },
  cyberNeon: {
    title: "Cyber Neon Pulse",
    colors: [
      { hex: '#0d001a', name: 'Void Black', closestNote: 'C1' },
      { hex: '#ff00aa', name: 'Magenta Surge', closestNote: 'A5' },
      { hex: '#00ffff', name: 'Cyan Blade', closestNote: 'C6' },
      { hex: '#ffea00', name: 'Acid Yellow', closestNote: 'E5' },
      { hex: '#9d00ff', name: 'Violet Static', closestNote: 'G#5' },
      { hex: '#00ff9d', name: 'Toxic Emerald', closestNote: 'B5' },
      { hex: '#ff6b6b', name: 'Hot Neon Pink', closestNote: 'F5' },
      { hex: '#1e90ff', name: 'Electric Blue', closestNote: 'D5' },
    ],
  },
  aurora: {
    title: "Aurora Veil",
    colors: [
      { hex: '#0b1e3f', name: 'Polar Night', closestNote: 'C2' },
      { hex: '#00f0ff', name: 'Aurora Cyan', closestNote: 'C6' },
      { hex: '#7df9ff', name: 'Ice Turquoise', closestNote: 'E6' },
      { hex: '#00ff85', name: 'Emerald Flare', closestNote: 'G5' },
      { hex: '#9d4edd', name: 'Purple Aurora', closestNote: 'A5' },
      { hex: '#ff00cc', name: 'Magenta Pulse', closestNote: 'B5' },
      { hex: '#ff6ec7', name: 'Pink Veil', closestNote: 'F5' },
      { hex: '#001f3f', name: 'Deep Abyss', closestNote: 'D2' },
    ],
  },
};

export const ColorPanel = () => {
  const {
    currentColor,
    setCurrentColor,
    favoriteColors,
    toggleFavoriteColor,
  } = useToolbarStore();

  const [activePalette, setActivePalette] = useState('rainbow');
  const [activeSolarGroup, setActiveSolarGroup] = useState('coreSolar'); // which sub-group in Solar

  const { copyColor } = useClipboard();
  const { showColorSelection } = useNotifications();

  const PaletteIcon = Icons.Palette;
  const StarIcon = Icons.Star;

  const getSolarSwatchClassName = (hex) => {
    const base = 'relative p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105';
    const selected = currentColor === hex;
    return [
      base,
      selected ? 'border-white shadow-lg shadow-white/30' : 'border-white/20 hover:border-white/40',
    ].join(' ');
  };

  const rainbowOctaves = useMemo(() => {
    const octaves = {};
    RAINBOW_PALETTE.data.forEach(note => {
      const octave = note.name.match(/\d+/)[0];
      if (!octaves[octave]) octaves[octave] = [];
      octaves[octave].push(note);
    });
    return octaves;
  }, []);

  const handleColorSelect = async (color) => {
    const hex = color.hex || color;
    setCurrentColor(hex);
    await copyColor({ hex });
    showColorSelection({ hex });
  };

  const isFavorite = (colorHex) => favoriteColors.includes(colorHex);

  return (
    <div className="space-y-4">
      {/* Palette Tabs */}
      <div className="flex gap-1 p-1 bg-gray-700 rounded-lg overflow-x-auto">
        <button
          onClick={() => setActivePalette('rainbow')}
          className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            activePalette === 'rainbow' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-600'
          }`}
        >
          Rainbow
        </button>
        <button
          onClick={() => setActivePalette('solar')}
          className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            activePalette === 'solar' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-600'
          }`}
        >
          Solar Flare +
        </button>
      </div>

      {/* Current Color Display */}
      <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
        <div className="w-12 h-12 rounded-lg border-2 border-white/20 shadow-inner" style={{ backgroundColor: currentColor }} />
        <div className="flex-1">
          <div className="text-xs font-mono text-gray-300 uppercase tracking-wide">{currentColor}</div>
          <div className="text-xs text-gray-400">Current</div>
        </div>
        <button
          onClick={() => toggleFavoriteColor(currentColor)}
          className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors"
          title={isFavorite(currentColor) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <StarIcon size={16} fill={isFavorite(currentColor) ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Favorites */}
      {favoriteColors.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Favorites</h3>
          <div className="grid grid-cols-4 gap-2">
            {favoriteColors.map((hex) => (
              <div key={hex} className="relative">
                <button
                  className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                    currentColor === hex ? 'border-white shadow-lg shadow-white/30' : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{ backgroundColor: hex }}
                  onClick={() => setCurrentColor(hex)}
                  title={hex}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavoriteColor(hex); }}
                  className="absolute -top-1 -right-1 p-0.5 bg-gray-800 rounded-full text-gray-400 hover:text-yellow-400"
                >
                  <Icons.X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Palette Content */}
      {(activePalette === 'rainbow' ? RAINBOW_PALETTE.data : SOLAR_FLARE_PALETTE.data).map((color) => (
        <ColorTooltip key={color.hex} color={color}>
          <button
            className={`w-16 h-16 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center ${
              currentColor === color.hex
                ? 'border-white shadow-lg shadow-white/30'
                : 'border-white/20 hover:border-white/40'
            }`}
            style={{ backgroundColor: color.hex }}
            onClick={() => handleColorSelect(color)}
            title={`${color.name} - ${color.freq}Hz`}
          >
            <div className="text-xs font-mono text-white/90 drop-shadow-md">
              {color.note || color.name}
            </div>
          </button>
        </ColorTooltip>
      ))}

      {activePalette === 'solar' && (
        <div className="space-y-6">
          {/* Sub-tabs / group selector for Solar Flare extended */}
          <div className="flex gap-2 flex-wrap">
            {Object.keys(EXTENDED_SOLAR_PALETTES).map((key) => (
              <button
                key={key}
                onClick={() => setActiveSolarGroup(key)}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                  activeSolarGroup === key
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {EXTENDED_SOLAR_PALETTES[key].title}
              </button>
            ))}
          </div>

          {/* Selected group colors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {EXTENDED_SOLAR_PALETTES[activeSolarGroup].colors.map((color, index) => (
              <ColorTooltip
                key={`${activeSolarGroup}-${index}`}
                color={color}
                showNote={true}
                showFrequency={true}
              >
                <div
                  className={getSolarSwatchClassName(color.hex)}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorSelect(color)}
                >
                  <div className="absolute top-1 right-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteColor(color.hex);
                      }}
                      className="p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                    >
                      <StarIcon
                        size={10}
                        className={isFavorite(color.hex) ? 'fill-yellow-400 text-yellow-400' : 'text-white/60'}
                      />
                    </button>
                  </div>
                  <div className="text-center pt-8">
                    <div className="text-xs font-semibold text-white drop-shadow-lg">
                      {color.name}
                    </div>
                    <div className="text-[10px] text-white/80 drop-shadow">
                      {color.closestNote}
                    </div>
                  </div>
                </div>
              </ColorTooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};