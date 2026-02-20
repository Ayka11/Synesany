import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useToolbarStore } from '../../stores/toolbarStore';

export const TimelineVisualization = ({ 
  duration = 180, 
  isGenerating = false,
  onGenerateTimeline,
  currentTime = 0,
  setCurrentTime 
}) => {
  const {
    sonificationMode,
    masterVolume,
    setMasterVolume
  } = useToolbarStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(0);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      setAudioContext(new AudioContext());
    }
  }, []);

  // Format time display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (!audioContext || !audioBuffer) return;

    if (isPlaying) {
      // Pause
      if (audioSource) {
        audioSource.stop();
        setAudioSource(null);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsPlaying(false);
    } else {
      // Play
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      const offset = currentTime;
      source.start(0, offset);
      
      setAudioSource(source);
      setIsPlaying(true);
      startTimeRef.current = audioContext.currentTime - offset;

      // Update progress
      const updateProgress = () => {
        if (audioContext && source) {
          const elapsed = audioContext.currentTime - startTimeRef.current;
          const newCurrentTime = Math.min(elapsed, duration);
          setCurrentTime(newCurrentTime);
          
          if (newCurrentTime < duration) {
            animationRef.current = requestAnimationFrame(updateProgress);
          } else {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        }
      };
      updateProgress();
    }
  };

  // Handle seek
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (isPlaying && audioSource) {
      audioSource.stop();
      setAudioSource(null);
      setIsPlaying(false);
      
      // Resume from new position
      setTimeout(() => handlePlayPause(), 0);
    }
  };

  // Handle skip
  const handleSkip = (direction) => {
    const skipAmount = 10; // 10 seconds
    const newTime = direction === 'forward' 
      ? Math.min(currentTime + skipAmount, duration)
      : Math.max(currentTime - skipAmount, 0);
    setCurrentTime(newTime);
    
    if (isPlaying && audioSource) {
      audioSource.stop();
      setAudioSource(null);
      setIsPlaying(false);
      setTimeout(() => handlePlayPause(), 0);
    }
  };

  // Generate timeline button
  const handleGenerateTimeline = () => {
    if (onGenerateTimeline) {
      onGenerateTimeline();
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/80">Timeline</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">
            Mode: <span className="text-purple-400 capitalize">{sonificationMode}</span>
          </span>
          <span className="text-xs text-white/60 font-mono bg-white/10 px-2 py-1 rounded">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Generate Timeline Button */}
      {!audioBuffer && (
        <div className="mb-4">
          <button
            onClick={handleGenerateTimeline}
            disabled={isGenerating}
            className="w-full p-3 rounded-lg border-2 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2 text-sm text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                Generating Timeline...
              </>
            ) : (
              <>
                <Play size={16} />
                Generate Timeline
              </>
            )}
          </button>
        </div>
      )}

      {/* Timeline Controls */}
      {audioBuffer && (
        <>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="relative">
              <div className="w-full bg-white/10 rounded-full h-2 relative">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>
              {/* Time markers */}
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>0:00</span>
                <span>{formatTime(Math.floor(duration / 4))}</span>
                <span>{formatTime(Math.floor(duration / 2))}</span>
                <span>{formatTime(Math.floor(duration * 3 / 4))}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => handleSkip('backward')}
              className="p-2 rounded-lg border-2 border-white/20 bg-white/5 hover:bg-white/10 transition-all"
            >
              <SkipBack size={16} />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="flex-1 p-3 rounded-lg border-2 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2 text-sm text-purple-400"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={() => handleSkip('forward')}
              className="p-2 rounded-lg border-2 border-white/20 bg-white/5 hover:bg-white/10 transition-all"
            >
              <SkipForward size={16} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 size={14} className="text-white/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-xs text-white/50 font-mono bg-white/10 px-2 py-1 rounded min-w-[3rem] text-center">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>
        </>
      )}

      {/* Mode Information */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-xs text-white/60">
          <div className="flex justify-between mb-1">
            <span>Duration:</span>
            <span className="text-white/80">{formatTime(duration)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Mode:</span>
            <span className="text-white/80 capitalize">{sonificationMode}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={audioBuffer ? "text-green-400" : "text-yellow-400"}>
              {audioBuffer ? "Ready" : isGenerating ? "Generating..." : "Not Generated"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
