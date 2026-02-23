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
    <div className="backdrop-blur-xl bg-black/60 border border-white/10 rounded-full px-4 py-2 shadow-xl flex items-center gap-2">
      <button
        onClick={onUndo}
        className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Undo"
      >
        <Icons.Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Redo"
      >
        <Icons.Redo2 className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-white/10" />
      <button
        onClick={onClearCanvas}
        className="p-2 rounded-full text-white/70 hover:text-red-400 hover:bg-white/10 transition-colors"
        title="Clear canvas"
      >
        <Icons.Trash2 className="w-4 h-4" />
      </button>
      <div className="w-px h-5 bg-white/10" />
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          isGenerating
            ? 'bg-purple-500/50 text-white/50 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-500'
        }`}
        title="Generate soundscape"
      >
        {isGenerating ? (
          <Icons.Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Icons.Sparkles className="w-4 h-4" />
        )}
        {isGenerating ? 'Generating…' : 'Generate'}
      </button>
      <div className="w-px h-5 bg-white/10" />
      <button
        onClick={() => onExport?.('wav')}
        className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        title="Export"
      >
        <Icons.Download className="w-4 h-4" />
      </button>
    </div>
  );
}
