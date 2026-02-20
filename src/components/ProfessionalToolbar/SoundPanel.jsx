import React, { useState, useRef } from 'react';
import { useToolbarStore } from '../../stores/toolbarStore';
import * as Icons from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { useDirectAudioPlayback } from '../../hooks/useDirectAudioPlayback';
import { useCanvas } from '../../contexts/CanvasContext';

export const SoundPanel = () => {
  const {
    masterVolume,
    setMasterVolume,
    sonificationMode,
    setSonificationMode,
    currentInstrument,
    setCurrentInstrument,
    adsr,
    setADSR,
    sonificationDurations,
    setSonificationDuration,
  } = useToolbarStore();
  
  // Get canvas ref from context
  const canvasRef = useCanvas();
  
  // Use direct audio playback hook
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    playSound, 
    stopPlayback,
    downloadAudio
  } = useDirectAudioPlayback(
    canvasRef, 
    sonificationMode, 
    currentInstrument, 
    masterVolume, 
    adsr
  );
  const SynthIcon = Icons.AudioWaveform || Icons.Music2 || Icons.Music;
  const PauseIcon = Icons.Pause;
  const PlayIcon = Icons.Play;
  const SettingsIcon = Icons.Settings;
  const HeadphonesIcon = Icons.Headphones;
  const DownloadIcon = Icons.Download;
  const FallbackInstrumentIcon = Icons.Music;

  const instruments = [
    { id: 'piano', name: 'Piano', icon: Icons.Piano, description: 'Classic piano sound' },
    { id: 'guitar', name: 'Guitar', icon: Icons.Guitar, description: 'Acoustic guitar' },
    { id: 'violin', name: 'Violin', icon: Icons.Music, description: 'Classical violin' },
    { id: 'trumpet', name: 'Trumpet', icon: Icons.Music2, description: 'Brass trumpet' },
    { id: 'drums', name: 'Drums', icon: Icons.Drum, description: 'Percussion kit' },
    { id: 'synth', name: 'Synth', icon: SynthIcon, description: 'Synthesizer' }
  ];

  const sonificationModes = [
    { id: 'simple', name: 'Simple', description: 'Basic tone mapping' },
    { id: 'timeline', name: 'Timeline', description: 'Time-based playback' },
    { id: 'colorfield', name: 'Color Field', description: 'Spatial audio mapping' },
    { id: 'harmonic', name: 'Harmonic', description: 'Multi-tone harmony' }
  ];

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        stopPlayback();
      } else {
        await playSound();
      }
    } catch (error) {
      console.error('Error with audio playback:', error);
    }
  };

  // Handle generate audio button
  const handleGenerateAudio = async () => {
    console.log('Generate Audio clicked', { 
      canvasRef: !!canvasRef.current, 
      sonificationMode, 
      currentInstrument, 
      masterVolume 
    });
    
    if (!canvasRef.current) {
      console.error('Canvas ref is null - cannot generate audio');
      return;
    }
    
    try {
      await playSound();
      console.log('Audio generation successful');
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  // Handle download audio button
  const handleDownloadAudio = async () => {
    console.log('Download Audio clicked', { 
      canvasRef: !!canvasRef.current, 
      sonificationMode, 
      currentInstrument 
    });
    
    if (!canvasRef.current) {
      console.error('Canvas ref is null - cannot download audio');
      return;
    }
    
    try {
      await downloadAudio();
      console.log('Audio download successful');
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  };

  // Helper functions for duration control
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDurationRange = (mode) => {
    switch (mode) {
      case 'simple':
        return { min: 30, max: 120 };  // 30s - 2min
      case 'timeline':
        return { min: 60, max: 300 };  // 1min - 5min
      case 'colorfield':
        return { min: 120, max: 480 }; // 2min - 8min
      case 'harmonic':
        return { min: 90, max: 360 };  // 1.5min - 6min
      default:
        return { min: 60, max: 180 };  // 1min - 3min default
    }
  };

  return (
    <div className="space-y-4">
      {/* Volume Control */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            Volume
          </label>
          <span className="text-xs text-white/50 font-mono bg-white/10 px-2 py-1 rounded">
            {Math.round(masterVolume * 100)}%
          </span>
        </div>
        <Tooltip content="Master volume control">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </Tooltip>
      </div>

      {/* Instrument Selection */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
          Instrument
        </h3>
          <div className="grid grid-cols-3 gap-2">
            {instruments.map((instrument) => (
              <Tooltip key={instrument.id} content={instrument.description}>
                <button
                  onClick={() => setCurrentInstrument(instrument.id)}
                  className={`
                    p-2 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1
                    ${currentInstrument === instrument.id
                      ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/30'
                      : 'border-white/20 hover:border-white/40 bg-white/5'
                    }
                  `}
                >
                  {(() => {
                    const InstrumentIcon = instrument.icon || FallbackInstrumentIcon;
                    return <InstrumentIcon size={16} />;
                  })()}
                  <span className="text-xs text-white/80">{instrument.name}</span>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>

      {/* Sonification Mode */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
          Sonification Mode
        </h3>
        <div className="grid grid-cols-2 gap-2">
            {sonificationModes.map((mode) => (
              <Tooltip key={mode.id} content={mode.description}>
                <button
                  onClick={() => setSonificationMode(mode.id)}
                  className={
                    `p-2 rounded-lg border-2 transition-all text-left ` +
                    (sonificationMode === mode.id
                      ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/20'
                      : 'border-white/20 hover:border-white/40 bg-white/5')
                  }
                >
                  <div className="text-xs text-white/80 font-medium">{mode.name}</div>
                  <div className="text-[10px] text-white/50">{mode.description}</div>
                </button>
              </Tooltip>
            ))}
          </div>
      </div>

      {/* Duration Control */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
            Duration
          </h3>
          <span className="text-xs text-white/50 font-mono bg-white/10 px-2 py-1 rounded">
            {formatDuration(sonificationDurations[sonificationMode])}
          </span>
        </div>
        <Tooltip content={`Set duration for ${sonificationMode} mode`}>
          <input
            type="range"
            min={getDurationRange(sonificationMode).min}
            max={getDurationRange(sonificationMode).max}
            step="30"
            value={sonificationDurations[sonificationMode]}
            onChange={(e) => setSonificationDuration(sonificationMode, parseInt(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </Tooltip>
        <div className="flex justify-between text-xs text-white/40 mt-1">
          <span>{formatDuration(getDurationRange(sonificationMode).min)}</span>
          <span>{formatDuration(getDurationRange(sonificationMode).max)}</span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center gap-1 p-2 rounded-lg border-2 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all text-xs text-indigo-400"
          >
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button
            onClick={handleGenerateAudio}
            className="flex items-center justify-center gap-1 p-2 rounded-lg border-2 border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-all text-xs text-green-400"
          >
            <SynthIcon size={14} />
            Generate
          </button>
          
          <button
            onClick={handleDownloadAudio}
            className="flex items-center justify-center gap-1 p-2 rounded-lg border-2 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all text-xs text-blue-400"
          >
            <DownloadIcon size={14} />
            Download
          </button>
          
          <button
            className="p-2 rounded-lg border-2 border-white/20 bg-white/5 hover:bg-white/10 transition-all"
            title="Audio Settings"
          >
            <SettingsIcon size={14} className="text-white/60" />
          </button>
        </div>

        {/* Progress Indicator */}
        {(isPlaying || currentTime > 0) && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Canvas Audio</span>
              <span>{formatDuration(currentTime)} / {formatDuration(duration)}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Generate Audio Status */}
        {!isPlaying && duration > 0 && (
          <div className="text-xs text-green-400 text-center">
            Audio generated successfully ({formatDuration(duration)})
          </div>
        )}
      </div>
    </div>
  );
};