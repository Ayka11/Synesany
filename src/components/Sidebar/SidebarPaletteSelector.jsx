import { useState, useEffect } from 'react';
import { Star, Heart } from 'lucide-react';
import { PALETTES } from '@/constants/palettes';
import { INSTRUMENTS } from '@/constants/instruments';
import { toast } from 'sonner';

export function PaletteSelector({ color, onColorChange, instrument }) {
  const [favoritePalettes, setFavoritePalettes] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('synesthetica_favorite_palettes');
    if (saved) {
      setFavoritePalettes(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('synesthetica_favorite_palettes', JSON.stringify(favoritePalettes));
  }, [favoritePalettes]);

  const toggleFavorite = (paletteName) => {
    setFavoritePalettes(prev => {
      if (prev.includes(paletteName)) {
        return prev.filter(name => name !== paletteName);
      } else {
        return [...prev, paletteName];
      }
    });
  };

  const handlePaletteClick = (paletteColor, palette) => {
    // Set the color
    onColorChange({ target: { value: paletteColor } });

    // Optional: Suggest instrument change if different from current
    if (palette.instrument && palette.instrument !== instrument) {
      toast.info(
        `Tip: Try "${INSTRUMENTS[palette.instrument].label}" with this palette!`,
        {
          duration: 2000,
        },
      );
    }
  };

  // Sort palettes: favorites first, then alphabetical
  const sortedPalettes = [...PALETTES].sort((a, b) => {
    const aFav = favoritePalettes.includes(a.name);
    const bFav = favoritePalettes.includes(b.name);
    
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
          Color Palettes
        </h3>
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <Heart size={12} />
          <span>Click to favorite</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
        {sortedPalettes.map((palette, idx) => {
          const isFavorite = favoritePalettes.includes(palette.name);
          
          return (
            <div
              key={idx}
              className={`group relative p-3 rounded-xl border transition-all duration-200 ${
                isFavorite 
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(palette.name)}
                className="absolute top-2 right-2 p-1 rounded-full transition-all duration-200 hover:scale-110"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star 
                  size={14} 
                  className={`transition-colors duration-200 ${
                    isFavorite 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-white/30 hover:text-yellow-400'
                  }`}
                />
              </button>

              {/* Palette Name */}
              <div className="mb-3">
                <h4 className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {palette.name}
                </h4>
                {palette.instrument && (
                  <p className="text-[10px] text-white/40 mt-0.5">
                    Suggested: {INSTRUMENTS[palette.instrument].label}
                  </p>
                )}
              </div>

              {/* Color Swatches */}
              <div className="flex gap-2 flex-wrap">
                {palette.colors.map((paletteColor, colorIdx) => (
                  <button
                    key={colorIdx}
                    onClick={() => handlePaletteClick(paletteColor, palette)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95 relative group ${
                      color.toLowerCase() === paletteColor.toLowerCase()
                        ? "border-white shadow-lg shadow-white/30 ring-2 ring-white/50"
                        : "border-white/20 hover:border-white/40 hover:shadow-md"
                    }`}
                    style={{ backgroundColor: paletteColor }}
                    title={paletteColor}
                  >
                    {/* Selected indicator */}
                    {color.toLowerCase() === paletteColor.toLowerCase() && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Custom Color Picker */}
      <div className="pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-white/60">Custom Color</h4>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <input
              type="color"
              value={color}
              onChange={onColorChange}
              className="w-12 h-12 rounded-lg border-2 border-white/20 cursor-pointer overflow-hidden bg-transparent"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white/50"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={color}
              onChange={onColorChange}
              className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white/80 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
