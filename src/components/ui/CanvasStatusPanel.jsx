import React from 'react';

export function CanvasStatusPanel({
  width,
  height,
  currentColor,
  selectedBrush,
  brushSize,
  soundEnabled,
  sonificationMode,
}) {
  return (
    <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-white text-xs space-y-1 min-w-[140px]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-white/60">Canvas</span>
        <span className="font-mono">{width}×{height}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-white/60">Color</span>
        <span
          className="w-4 h-4 rounded-full border border-white/20"
          style={{ backgroundColor: currentColor }}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-white/60">Brush</span>
        <span className="font-mono capitalize">{selectedBrush}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-white/60">Size</span>
        <span className="font-mono">{brushSize}px</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-white/60">Sound</span>
        <span>{soundEnabled ? '🔊' : '🔇'}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-white/60">Mode</span>
        <span className="font-mono capitalize">{sonificationMode}</span>
      </div>
    </div>
  );
}
