import React from 'react';

export function FloatingControls({
  isGenerating,
  onGenerate,
  onClearCanvas,
  onUndo,
  onRedo,
  onExport,
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 shadow-xl">
      <button
        onClick={onUndo}
        aria-label="Undo"
        className="p-2 text-white/70 hover:text-white transition-colors"
        title="Undo"
      >
        ↩
      </button>
      <button
        onClick={onRedo}
        aria-label="Redo"
        className="p-2 text-white/70 hover:text-white transition-colors"
        title="Redo"
      >
        ↪
      </button>
      <button
        onClick={onClearCanvas}
        aria-label="Clear Canvas"
        className="p-2 text-white/70 hover:text-white transition-colors"
        title="Clear Canvas"
      >
        🗑
      </button>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        aria-label={isGenerating ? 'Generating soundscape' : 'Generate soundscape'}
        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm rounded-full transition-colors"
      >
        {isGenerating ? '⏳ Generating...' : '🎵 Generate'}
      </button>
      <button
        onClick={() => onExport?.('png')}
        aria-label="Export as PNG"
        className="p-2 text-white/70 hover:text-white transition-colors"
        title="Export as PNG"
      >
        ⬇
      </button>
    </div>
  );
}
