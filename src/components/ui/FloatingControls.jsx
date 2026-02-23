import React, { useState } from 'react';
import { Download, Settings2, RotateCcw, RotateCw, Trash2, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

export function FloatingControls({
  isGenerating,
  onGenerate,
  onClearCanvas,
  onUndo,
  onRedo,
  onExport,
}) {
  const [showExportOptions, setShowExportOptions] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/60 p-3 px-6 backdrop-blur-3xl shadow-2xl">
      {/* Undo / Redo */}
      <button
        onClick={onUndo}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
        title="Undo"
      >
        <RotateCcw size={16} />
      </button>

      <button
        onClick={onRedo}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
        title="Redo"
      >
        <RotateCw size={16} />
      </button>

      <div className="w-px h-6 bg-white/10" />

      {/* Clear Canvas */}
      <button
        onClick={onClearCanvas}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
        title="Clear Canvas"
      >
        <Trash2 size={16} />
      </button>

      <div className="w-px h-6 bg-white/10" />

      {/* Generate */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={`flex items-center gap-2 rounded-2xl px-6 py-2 text-sm font-bold transition-all ${
          isGenerating
            ? 'bg-white/5 text-white/20 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95'
        }`}
      >
        {isGenerating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Settings2 size={16} />
            </motion.div>
            Processing…
          </>
        ) : (
          <>
            <Wand2 size={16} />
            Generate
          </>
        )}
      </button>

      {/* Export */}
      <div className="relative">
        <button
          onClick={() => setShowExportOptions(!showExportOptions)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
          title="Export"
        >
          <Download size={16} />
        </button>

        {showExportOptions && (
          <div className="absolute bottom-full mb-2 right-0 bg-black/90 border border-white/10 rounded-xl p-2 backdrop-blur-xl min-w-[100px]">
            {['mp3', 'wav', 'midi'].map((format) => (
              <button
                key={format}
                onClick={() => {
                  onExport?.(format);
                  setShowExportOptions(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
