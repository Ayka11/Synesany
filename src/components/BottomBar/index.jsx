import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock, Zap, Settings } from 'lucide-react';

export const BottomBar = ({ 
  isPlaying, 
  onPlayPause, 
  currentTime, 
  duration, 
  onSeek,
  volume,
  onVolumeChange 
}) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-12 bg-gray-900/50 backdrop-blur-lg border-t border-white/10 flex items-center justify-between px-6">
      {/* Left - Status Info */}
      <div className="flex items-center gap-4 text-xs text-white/60">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap size={12} />
          <span>60 FPS</span>
        </div>
        <div className="flex items-center gap-1">
          <Settings size={12} />
          <span>1920x1080</span>
        </div>
      </div>

      {/* Center - Playback Controls */}
      <div className="flex items-center gap-4">
        <button className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <SkipBack size={16} />
        </button>
        
        <button
          onClick={onPlayPause}
          className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <button className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <SkipForward size={16} />
        </button>

        {/* Progress Bar */}
        <div className="w-64 bg-white/10 rounded-full h-1 relative">
          <div 
            className="absolute left-0 top-0 h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={onSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Right - Volume and Tools */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-white/60" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
            className="w-20 accent-purple-500"
          />
        </div>
        
        <div className="text-xs text-white/60">
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
};
