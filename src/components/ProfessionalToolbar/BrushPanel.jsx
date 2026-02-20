import React, { useState } from 'react';
import { useToolbarStore } from '../../stores/toolbarStore';
import * as Icons from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { BrushPreview } from '../Canvas/BrushPreview';

export const BrushPanel = () => {
  const {
    selectedBrush,
    setSelectedBrush,
    brushSize,
    setBrushSize,
    favoriteBrushes,
    toggleFavoriteBrush: storeToggleFavoriteBrush,
  } = useToolbarStore();
  
  const [localFavoriteBrushes, setLocalFavoriteBrushes] = useState([]);
  
  // Brush definitions with icons and descriptions
  const brushes = [
    { id: 'round', name: 'Round', icon: '●', description: 'Soft circular brush', timbre: 'smooth' },
    { id: 'square', name: 'Square', icon: '■', description: 'Hard edged square', timbre: 'sharp' },
    { id: 'sawtooth', name: 'Sawtooth', icon: '⚡', description: 'Jagged textured stroke', timbre: 'bright' },
    { id: 'triangle', name: 'Triangle', icon: '▲', description: 'Angular triangular brush', timbre: 'hollow' },
    { id: 'star', name: 'Star', icon: '★', description: 'Five-pointed star shape', timbre: 'sparkling' },
    { id: 'cross', name: 'Cross', icon: '✚', description: 'Cross-shaped brush', timbre: 'percussive' },
    { id: 'spray', name: 'Spray', icon: '◈', description: 'Spray paint effect', timbre: 'airy' },
    { id: 'calligraphy', name: 'Calligraphy', icon: '✒', description: 'Elegant calligraphy stroke', timbre: 'expressive' },
    { id: 'marker', name: 'Marker', icon: '▬', description: 'Marker-like stroke', timbre: 'bold' },
    { id: 'pencil', name: 'Pencil', icon: '✏', description: 'Soft pencil texture', timbre: 'subtle' }
  ];

  const isFavorite = (brushId) => favoriteBrushes.includes(brushId);

  return (
    <div className="space-y-4">
      {/* Brush Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {brushes.map((brush) => (
          <Tooltip key={brush.id} content={`${brush.name} - ${brush.description}`}>
            <button
              onClick={() => setSelectedBrush(brush.id)}
              className={`
                relative p-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95
                ${selectedBrush === brush.id
                  ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/30'
                  : 'border-white/20 hover:border-white/40 bg-white/5'
                }
              `}
            >
              <div className="text-2xl mb-1">{brush.icon}</div>
              <div className="text-xs font-medium text-white/80 truncate">{brush.name}</div>
              <div className="text-[10px] text-white/50 truncate">{brush.timbre}</div>
              
              {/* Favorite Button */}
              <Tooltip content={isFavorite(brush.id) ? 'Remove from favorites' : 'Add to favorites'}>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    storeToggleFavoriteBrush(brush.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      storeToggleFavoriteBrush(brush.id);
                    }
                  }}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                  aria-label={isFavorite(brush.id) ? 'Unfavorite brush' : 'Favorite brush'}
                >
                  <Icons.Star 
                    size={10} 
                    className={isFavorite(brush.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/60'}
                  />
                </span>
              </Tooltip>
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Brush Preview */}
      <div className="flex justify-center">
        <BrushPreview
          brushType={selectedBrush}
          brushSize={brushSize}
          color="#ff0000"
        />
      </div>

      {/* Brush Size Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            Brush Size
          </label>
          <span className="text-xs text-white/50 font-mono bg-white/10 px-2 py-1 rounded">
            {brushSize}px
          </span>
        </div>
        
        <Tooltip content="Adjust brush thickness">
        <input
          type="range"
          min="1"
          max="64"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </Tooltip>
        
        {/* Size Presets */}
        <div className="flex gap-2">
          {[1, 5, 10, 20, 40].map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`
                flex-1 py-1 text-xs rounded transition-all
                ${brushSize === size
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Brush Preview */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <div className="text-xs font-semibold text-white/70 mb-2">Preview</div>
        <div className="flex items-center justify-center h-16 bg-black/20 rounded">
          <div 
            className="rounded-full bg-indigo-500"
            style={{ 
              width: `${brushSize}px`, 
              height: `${brushSize}px`,
              maxWidth: '60px',
              maxHeight: '60px'
            }}
          />
        </div>
      </div>
    </div>
  );
};
