import React from 'react';

export function TimeScale({
  sonificationMode,
  duration,
  currentTime,
  visualZoom,
  onSeek,
  className,
}) {
  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

  return (
    <div className={`backdrop-blur-xl bg-black/60 border border-white/10 rounded-xl px-4 py-2 shadow-xl ${className ?? ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-white/60 text-xs font-mono min-w-[36px]">
          {formatTime(currentTime)}
        </span>
        <div
          className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative"
          onClick={(e) => {
            if (!onSeek || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            onSeek(ratio * duration);
          }}
        >
          <div
            className="absolute inset-y-0 left-0 bg-purple-500 rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-white/60 text-xs font-mono min-w-[36px] text-right">
          {formatTime(duration)}
        </span>
        {visualZoom !== undefined && (
          <span className="text-white/40 text-xs font-mono">×{visualZoom}</span>
        )}
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (seconds == null || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
