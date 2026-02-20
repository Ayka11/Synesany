export function ADSRControls({
  attack,
  onAttackChange,
  decay,
  onDecayChange,
  sustain,
  onSustainChange,
  release,
  onReleaseChange,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-2xl shadow-2xl">
      <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 text-center mb-1">
        Envelope (ADSR)
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-medium text-white/50">Attack</label>
          <span className="text-[9px] font-mono text-purple-400">
            {(attack * 1000).toFixed(0)}ms
          </span>
        </div>
        <input
          type="range"
          min="0.001"
          max="0.5"
          step="0.001"
          value={attack}
          onChange={onAttackChange}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-purple-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-medium text-white/50">Decay</label>
          <span className="text-[9px] font-mono text-purple-400">
            {(decay * 1000).toFixed(0)}ms
          </span>
        </div>
        <input
          type="range"
          min="0.001"
          max="0.5"
          step="0.001"
          value={decay}
          onChange={onDecayChange}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-purple-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-medium text-white/50">
            Sustain
          </label>
          <span className="text-[9px] font-mono text-purple-400">
            {(sustain * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sustain}
          onChange={onSustainChange}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-purple-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-medium text-white/50">
            Release
          </label>
          <span className="text-[9px] font-mono text-purple-400">
            {(release * 1000).toFixed(0)}ms
          </span>
        </div>
        <input
          type="range"
          min="0.001"
          max="1"
          step="0.001"
          value={release}
          onChange={onReleaseChange}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-purple-500"
        />
      </div>
    </div>
  );
}
