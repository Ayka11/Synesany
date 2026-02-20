import React from 'react';
import * as Icons from 'lucide-react';

export const TimeScale = ({ 
  sonificationMode, 
  duration, 
  currentTime = 0, 
  visualZoom = 1,
  onSeek 
}) => {
  // Get time scale configuration based on mode
  const getTimeScaleConfig = (mode) => {
    switch (mode) {
      case 'simple':
        return { 
          interval: 10, 
          format: 'seconds',
          markers: 12, // Every 10 seconds for 2 minutes
          label: 'Simple Mode (0:00 - 2:00)'
        };
      case 'timeline':
        return { 
          interval: 30, 
          format: 'seconds',
          markers: 10, // Every 30 seconds for 5 minutes
          label: 'Timeline Mode (0:00 - 5:00)'
        };
      case 'colorfield':
        return { 
          interval: 60, 
          format: 'minutes',
          markers: 8, // Every 1 minute for 8 minutes
          label: 'Color Field Mode (0:00 - 8:00)'
        };
      case 'harmonic':
        return { 
          interval: 4, 
          format: 'measures',
          markers: 90, // Every 4 seconds (1 measure) for 6 minutes
          label: 'Harmonic Mode (Musical Measures)'
        };
      default:
        return { 
          interval: 30, 
          format: 'seconds',
          markers: 6,
          label: 'Unknown Mode'
        };
    }
  };

  const config = getTimeScaleConfig(sonificationMode);
  
  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Generate time markers
  const generateTimeMarkers = () => {
    const markers = [];
    const totalMarkers = Math.min(config.markers, Math.floor(duration / config.interval));
    
    for (let i = 0; i <= totalMarkers; i++) {
      const time = i * config.interval;
      const position = (time / duration) * 100;
      
      let label;
      if (config.format === 'minutes') {
        label = `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
      } else if (config.format === 'measures') {
        label = `M${i + 1}`;
      } else {
        label = formatTime(time);
      }
      
      markers.push({ time, position, label });
    }
    
    return markers;
  };

  const timeMarkers = generateTimeMarkers();
  const currentProgress = (currentTime / duration) * 100;

  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-sm border-t border-white/10">
      {/* Mode Label */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <Icons.Clock size={14} className="text-white/60" />
          <span className="text-xs font-medium text-white/80">{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">Current:</span>
          <span className="text-xs font-mono text-white/80 bg-white/10 px-2 py-1 rounded">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      {/* Time Scale Ruler */}
      <div className="relative px-4 py-3">
        {/* Progress Bar */}
        <div className="relative h-8 bg-gray-700/50 rounded-full overflow-hidden mb-2">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-200"
            style={{ width: `${currentProgress}%` }}
          />
          
          {/* Interactive Seek Bar */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => onSeek?.(parseFloat(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ transform: `scaleX(${visualZoom})` }}
          />
          
          {/* Current Time Indicator */}
          <div 
            className="absolute top-0 h-full w-0.5 bg-white shadow-lg"
            style={{ left: `${currentProgress}%` }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full shadow-lg" />
          </div>
        </div>

        {/* Time Markers */}
        <div className="relative h-6">
          {timeMarkers.map((marker, index) => (
            <div
              key={index}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${marker.position}%` }}
            >
              {/* Tick Mark */}
              <div className="w-0.5 h-2 bg-white/40" />
              {/* Time Label */}
              <span className="text-[10px] text-white/60 mt-1 whitespace-nowrap">
                {marker.label}
              </span>
            </div>
          ))}
        </div>

        {/* Duration Indicators */}
        <div className="flex justify-between mt-3 text-xs text-white/40">
          <span>0:00</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Mode Information */}
      <div className="px-4 py-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/60">
          <div>Mode: <span className="text-white/80 capitalize">{sonificationMode}</span></div>
          <div>Interval: <span className="text-white/80">{config.interval}s</span></div>
          <div>Zoom: <span className="text-white/80">{Math.round(visualZoom * 100)}%</span></div>
        </div>
      </div>
    </div>
  );
};
