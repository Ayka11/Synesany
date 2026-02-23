import React from 'react';
import * as Icons from 'lucide-react';

export function FloatingControls({
  isGenerating,
  onGenerate,
  onClearCanvas,
  onUndo,
  onRedo,
  onExport,
}) {
  return (
    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 shadow-xl">
      <button
        onClick={onUndo}
        title="Undo"
        className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Icons.Undo2 size={16} />
      </button>
      <button
        onClick={onRedo}
        title="Redo"
        className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Icons.Redo2 size={16} />
      </button>
      <div className="w-px h-5 bg-white/20" />
      <button
        onClick={onClearCanvas}
        title="Clear canvas"
        className="p-2 rounded-full text-white/70 hover:text-red-400 hover:bg-white/10 transition-colors"
      >
        <Icons.Trash2 size={16} />
      </button>
      <div className="w-px h-5 bg-white/20" />
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        title="Generate soundscape"
        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
      >
        {isGenerating ? (
          <>
            <Icons.Loader2 size={14} className="animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Icons.Music size={14} />
            Generate
          </>
        )}
      </button>
      <div className="w-px h-5 bg-white/20" />
      <button
        onClick={() => onExport?.('png')}
        title="Export as PNG"
        className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Icons.Download size={16} />
      </button>
    </div>
  );
}
