import { Undo2, Redo2, Trash2 } from "lucide-react";

export function HistoryControls({
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  onClear,
  historyStep,
  historyLength,
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-2xl shadow-2xl">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
          canUndo
            ? "text-white/60 hover:bg-white/5 hover:text-white cursor-pointer"
            : "text-white/10 cursor-not-allowed"
        }`}
        title={
          canUndo ? `Undo (Ctrl+Z) - ${historyStep} steps` : "Nothing to undo"
        }
      >
        <Undo2 size={20} />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
          canRedo
            ? "text-white/60 hover:bg-white/5 hover:text-white cursor-pointer"
            : "text-white/10 cursor-not-allowed"
        }`}
        title={
          canRedo
            ? `Redo (Ctrl+Y) - ${historyLength - historyStep - 1} steps`
            : "Nothing to redo"
        }
      >
        <Redo2 size={20} />
      </button>
      <div className="h-px bg-white/5 my-1" />
      <button
        onClick={onClear}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-white/40 hover:bg-red-500/20 hover:text-red-400"
        title="Clear canvas"
      >
        <Trash2 size={20} />
      </button>

      {/* History indicator */}
      <div className="mt-2 text-center">
        <div className="text-[9px] font-bold uppercase tracking-wider text-white/20">
          History
        </div>
        <div className="text-[11px] font-mono text-white/30">
          {historyStep}/{historyLength - 1}
        </div>
      </div>
    </div>
  );
}
