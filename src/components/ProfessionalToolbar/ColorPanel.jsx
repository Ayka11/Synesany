import React, { useState } from 'react';
import { useToolbarStore } from '../../stores/toolbarStore';
import { ColorTooltip } from '../ui/Tooltip/ColorTooltip';
import { useClipboard } from '../../hooks/useClipboard';
import { useNotifications } from '../../hooks/useNotifications.jsx';
import { RAINBOW_PALETTE, EXTENDED_SOLAR_PALETTES } from '../../constants/palettes';
import * as Icons from 'lucide-react';
import { ColorSelectionToast } from '../ui/Toast/ColorSelectionToast';
import { Tooltip } from '../ui/Tooltip/index.jsx';
import ColorWheel from '../ColorWheel';

const getSolarPaletteData = (activeSolarGroup) => {
  const activeGroup = activeSolarGroup;
  if (!EXTENDED_SOLAR_PALETTES[activeGroup]) {
    return EXTENDED_SOLAR_PALETTES.coreSolar.data;
  }
  return EXTENDED_SOLAR_PALETTES[activeGroup]?.data || EXTENDED_SOLAR_PALETTES.coreSolar.data;
};

export const ColorPanel = () => {
  const {
    currentColor,
    setCurrentColor,
    favoriteColors,
    toggleFavoriteColor,
  } = useToolbarStore();
  const [activePalette, setActivePalette] = useState('rainbow');
  const [activeSolarGroup, setActiveSolarGroup] = useState('coreSolar');
  const { copyColor } = useClipboard();
  const { showColorSelection } = useNotifications();
  const PaletteIcon = Icons.Palette;
  const StarIcon = Icons.Star;
  const ColorWheelIcon = Icons.Palette;

  const handleColorSelect = async (color) => {
    setCurrentColor(color.hex);
    await copyColor(color);
    showColorSelection(color);
  };

  const isFavorite = (colorHex) => favoriteColors.includes(colorHex);

  const getSolarSwatchClassName = (hex) => {
    const base = 'relative p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105';
    const selected = currentColor === hex;
    return [
      base,
      selected ? 'border-white shadow-lg shadow-white/30' : 'border-white/20 hover:border-white/40',
    ].join(' ');
  };

  const paletteDataRaw = activePalette === 'rainbow'
    ? RAINBOW_PALETTE?.data
    : getSolarPaletteData(activeSolarGroup);
  const paletteData = Array.isArray(paletteDataRaw) ? paletteDataRaw : [];

  return (
    <div className="space-y-4">
      {/* Palette Tabs */}
      <div className="flex gap-1 p-1 bg-gray-700 rounded-lg">
        <button
          onClick={() => setActivePalette('rainbow')}
          className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            activePalette === 'rainbow'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Rainbow
        </button>
        <button
          onClick={() => setActivePalette('colorwheel')}
          className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            activePalette === 'colorwheel'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Color Wheel
        </button>
        <button
          onClick={() => setActivePalette('solar')}
          className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
            activePalette === 'solar'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          Solar
        </button>
      </div>

      {/* Current Color Display */}
      <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
        <div
          className="w-12 h-12 rounded-lg border-2 border-white/20 shadow-inner"
          style={{ backgroundColor: currentColor }}
        />
        <div className="flex-1">
          <div className="text-xs font-mono text-gray-300 uppercase tracking-wide">{currentColor}</div>
          <div className="text-xs text-gray-400">Current</div>
        </div>
        <Tooltip content={isFavorite(currentColor) ? 'Remove from favorites' : 'Add to favorites'}>
          <button
            onClick={() => toggleFavoriteColor(currentColor)}
            className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <StarIcon size={16} fill={isFavorite(currentColor) ? 'currentColor' : 'none'} />
          </button>
        </Tooltip>
      </div>

      {/* Favorites */}
      {favoriteColors.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Favorites</h3>
          <div className="grid grid-cols-4 gap-2">
            {favoriteColors.map((hex) => (
              <Tooltip key={hex} content={`Click to select ${hex}`}>
                <button
                  className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                    currentColor === hex
                      ? 'border-white shadow-lg shadow-white/30'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{ backgroundColor: hex }}
                  onClick={() => setCurrentColor(hex)}
                  title={hex}
                >
                  <div className="relative w-full h-full">
                    <Tooltip content="Remove from favorites">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavoriteColor(hex); }}
                        className="absolute -top-1 -right-1 p-0.5 bg-gray-800 rounded-full text-gray-400 hover:text-yellow-400"
                      >
                        <Icons.X size={10} />
                      </button>
                    </Tooltip>
                  </div>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      )}

      {/* Solar Sub-Palette Selector */}
      {activePalette === 'solar' && (
        <div>
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
        </div>
      )}

      {/* Palette Content */}
      <div>
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
          {activePalette === 'rainbow' ? 'Rainbow Spectrum' : EXTENDED_SOLAR_PALETTES[activeSolarGroup]?.title || 'Solar Flare'}
        </h3>
        
        {activePalette === 'colorwheel' && (
          <ColorWheel />
        )}
        
        {activePalette === 'rainbow' && (
          <div className="space-y-3">
            {/* Octave Groups */}
            {(() => {
              const octaves = [];
              for (let octave = 0; octave <= 7; octave++) {
                const startIdx = octave * 12;
                const endIdx = Math.min(startIdx + 11, paletteData.length - 1);
                const octaveColors = paletteData.slice(startIdx, endIdx + 1);
                const startFreq = octaveColors[0]?.freq || 0;
                const endFreq = octaveColors[octaveColors.length - 1]?.freq || 0;
                
                octaves.push(
                  <div key={octave} className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-white/80">Octave {octave}</h4>
                      <span className="text-xs text-gray-400 font-mono">
                        {Math.round(startFreq)}-{Math.round(endFreq)}Hz
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {octaveColors.map((color) => (
                        <ColorTooltip key={color.hex} color={color}>
                          <button
                            className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center ${
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
                    </div>
                  </div>
                );
              }
              return octaves;
            })()}
          </div>
        )}
        
        {activePalette !== 'rainbow' && (
          <div className="grid grid-cols-4 gap-3">
            {paletteData.map((color) => (
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
          </div>
        )}
      </div>
    </div>
  );
};
