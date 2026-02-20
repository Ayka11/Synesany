import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useToolbarStore, getFrequencyFromColor, getNoteFromFrequency } from '../stores/toolbarStore.js';

const ColorWheel = () => {
  const { currentColor, setCurrentColor } = useToolbarStore();
  const [hsl, setHsl] = useState({ h: 0, s: 70, l: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Convert current color to HSL
  useEffect(() => {
    const hex = currentColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    setHsl({ h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) });
  }, [currentColor]);

  // Convert HSL to hex
  const hslToHex = useCallback((h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);

  // Get frequency from HSL
  const getFrequencyFromHsl = useCallback((h, s, l) => {
    return getFrequencyFromColor(hslToHex(h, s, l));
  }, [getFrequencyFromColor, hslToHex]);

  // Get musical note from frequency
  const getNoteFromFrequency = useCallback((frequency) => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const a4 = 440;
    const semitones = 12 * Math.log2(frequency / a4);
    const noteIndex = Math.round(semitones) % 12;
    const octave = Math.floor((semitones + 57) / 12);
    const noteName = noteNames[noteIndex < 0 ? noteIndex + 12 : noteIndex];
    const noteOctave = octave;
    return `${noteName}${noteOctave}`;
  }, []);

  // Play preview tone
  const playPreviewTone = useCallback((frequency) => {
    if (!audioContextRef.current) return;

    const osc = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    
    gain.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(audioContextRef.current.destination);

    osc.start(audioContextRef.current.currentTime);
    osc.stop(audioContextRef.current.currentTime + 0.2);
  }, []);

  // Handle color selection
  const handleColorSelect = useCallback((newColor) => {
    setCurrentColor(newColor);
    const frequency = getFrequencyFromColor(newColor);
    playPreviewTone(frequency);
  }, [setCurrentColor, getFrequencyFromColor, playPreviewTone]);

  // Handle wheel interaction
  const handleWheelInteraction = useCallback((clientX, clientY) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;

    // Calculate angle (hue)
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360) % 360;

    // Calculate distance from center (saturation)
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = Math.min(centerX, centerY) - 10;
    const saturation = Math.min(100, (distance / maxDistance) * 100);

    // Calculate lightness (could be separate control)
    const lightness = hsl.l;

    setHsl({ h: Math.round(angle), s: Math.round(saturation), l: lightness });
    
    const newColor = hslToHex(angle, saturation, lightness);
    handleColorSelect(newColor);
  }, [hsl.l, hslToHex, handleColorSelect]);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleWheelInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleWheelInteraction(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Draw color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 1) * (Math.PI / 180);
      const endAngle = angle * (Math.PI / 180);

      for (let r = 0; r <= radius; r++) {
        const saturation = (r / radius) * 100;
        const color = hslToHex(angle, saturation, 50);
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.arc(centerX, centerY, r, startAngle, endAngle);
        ctx.stroke();
      }
    }

    // Draw note markers
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    noteNames.forEach((note, index) => {
      const angle = (index * 30) * (Math.PI / 180);
      const x = centerX + Math.cos(angle) * (radius + 15);
      const y = centerY + Math.sin(angle) * (radius + 15);

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(note, x, y);
    });

    // Draw current position indicator
    const currentAngle = hsl.h * (Math.PI / 180);
    const currentRadius = (hsl.s / 100) * radius;
    const indicatorX = centerX + Math.cos(currentAngle) * currentRadius;
    const indicatorY = centerY + Math.sin(currentAngle) * currentRadius;

    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [hsl, hslToHex]);

  const frequency = getFrequencyFromHsl(hsl.h, hsl.s, hsl.l);
  const note = getNoteFromFrequency(frequency);

  return (
    <div className="space-y-4">
      {/* Current Color Display */}
      <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
        <div
          className="w-12 h-12 rounded-lg border-2 border-white/20 shadow-inner"
          style={{ backgroundColor: currentColor }}
        />
        <div className="flex-1">
          <div className="text-xs font-mono text-gray-300 uppercase tracking-wide">{currentColor}</div>
          <div className="text-xs text-gray-400">{note} • {Math.round(frequency)}Hz</div>
        </div>
      </div>

      {/* Color Wheel Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="border-2 border-gray-600 rounded-lg cursor-crosshair bg-gray-800"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* HSL Controls */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Hue</span>
            <span className="text-xs text-gray-400">{hsl.h}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={hsl.h}
            onChange={(e) => {
              const newHsl = { ...hsl, h: parseInt(e.target.value) };
              setHsl(newHsl);
              const newColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
              handleColorSelect(newColor);
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, 
                hsl(0, 70%, 60%), 
                hsl(60, 70%, 60%), 
                hsl(120, 70%, 60%), 
                hsl(180, 70%, 60%), 
                hsl(240, 70%, 60%), 
                hsl(300, 70%, 60%), 
                hsl(360, 70%, 60%))`
            }}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Saturation</span>
            <span className="text-xs text-gray-400">{hsl.s}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={hsl.s}
            onChange={(e) => {
              const newHsl = { ...hsl, s: parseInt(e.target.value) };
              setHsl(newHsl);
              const newColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
              handleColorSelect(newColor);
            }}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Lightness</span>
            <span className="text-xs text-gray-400">{hsl.l}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={hsl.l}
            onChange={(e) => {
              const newHsl = { ...hsl, l: parseInt(e.target.value) };
              setHsl(newHsl);
              const newColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
              handleColorSelect(newColor);
            }}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>• Click and drag on the wheel to select colors</p>
        <p>• Each position corresponds to a specific frequency</p>
        <p>• Note markers show musical intervals around the wheel</p>
      </div>
    </div>
  );
};

export default ColorWheel;
