import React, { useState } from 'react';
import { RAINBOW_PALETTE } from '@/constants/palettes';

export function ColorPalette({ onColorSelect, currentColor, compact = false }) {
  const [activeOctave, setActiveOctave] = useState(null);

  const paletteData = Array.isArray(RAINBOW_PALETTE?.data) ? RAINBOW_PALETTE.data : [];

  // Group colors by octave (12 per octave)
  const octaves = [];
  for (let o = 0; o <= 7; o++) {
    const slice = paletteData.slice(o * 12, o * 12 + 12);
    if (slice.length > 0) octaves.push({ index: o, colors: slice });
  }

  const COMPACT_SAMPLE_INTERVAL = 8; // show every 8th color for a representative spread

  const handleSelect = (color) => {
    onColorSelect?.(color);
  };

  if (compact) {
    // Compact view: single row of recent/sampled colors
    return (
      <div className="flex flex-wrap gap-1">
        {paletteData.filter((_, i) => i % COMPACT_SAMPLE_INTERVAL === 0).map((color) => (
          <button
            key={color.hex}
            title={`${color.name} — ${Math.round(color.freq)}Hz`}
            onClick={() => handleSelect(color)}
            className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-110 ${
              currentColor === color.hex
                ? 'border-white shadow-lg'
                : 'border-white/20 hover:border-white/50'
            }`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Octave filter tabs */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setActiveOctave(null)}
          className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
            activeOctave === null
              ? 'bg-indigo-600 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          All
        </button>
        {octaves.map(({ index }) => (
          <button
            key={index}
            onClick={() => setActiveOctave(activeOctave === index ? null : index)}
            className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
              activeOctave === index
                ? 'bg-indigo-600 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Oct {index}
          </button>
        ))}
      </div>

      {/* Color swatches */}
      <div className="space-y-3">
        {octaves
          .filter(({ index }) => activeOctave === null || activeOctave === index)
          .map(({ index, colors }) => (
            <div key={index}>
              <p className="text-xs text-white/50 mb-1">Octave {index}</p>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    title={`${color.name} — ${Math.round(color.freq)}Hz`}
                    onClick={() => handleSelect(color)}
                    className={`w-7 h-7 rounded-md border-2 transition-all hover:scale-110 ${
                      currentColor === color.hex
                        ? 'border-white shadow-lg shadow-white/30'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ColorPalette;
