import React from 'react';
import * as Icons from 'lucide-react';

export const FloatingControls = ({
  isGenerating,
  onGenerate,
  onClearCanvas,
  onUndo,
  onRedo,
  onExport,
}) => {
  return (
    <div className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-2xl">
      <button
        onClick={onUndo}
        className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        title="Undo"
      >
        <Icons.Undo2 size={16} />
      </button>

      <button
        onClick={onRedo}
        className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        title="Redo"
      >
        <Icons.Redo2 size={16} />
      </button>

      <div className="w-px h-5 bg-white/20 mx-1" />

      <button
        onClick={onClearCanvas}
        className="p-2 text-white/60 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors"
        title="Clear Canvas"
      >
        <Icons.Trash2 size={16} />
      </button>

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
          ${isGenerating
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25'
          }
        `}
        title="Generate Soundscape"
      >
        {isGenerating ? (
          <>
            <Icons.Loader2 size={14} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Icons.Music size={14} />
            Generate
          </>
        )}
      </button>

      <div className="w-px h-5 bg-white/20 mx-1" />

      <button
        onClick={() => onExport?.('wav')}
        className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        title="Export"
      >
        <Icons.Download size={16} />
      </button>
    </div>
  );
};
