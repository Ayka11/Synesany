import React, { useState, useRef, useEffect } from 'react';
import { useToolbarStore, getFrequencyFromColor, getNoteFromFrequency } from '../stores/toolbarStore';

const ColorPicker = ({ compact = false }) => {
  const { currentColor, setCurrentColor } = useToolbarStore();
  const [hsl, setHsl] = useState({ h: 0, s: 70, l: 60 });
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

  // Convert hex to HSL
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
  const hslToHex = (h, s, l) => {
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
  };

  // Handle color change with tone preview
  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
    if (audioContextRef.current) {
      const frequency = getFrequencyFromColor(newColor);
      const now = audioContextRef.current.currentTime;
      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(audioContextRef.current.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    }
  };

  // Handle HSL change
  const handleHslChange = (key, value) => {
    const newHsl = { ...hsl, [key]: value };
    setHsl(newHsl);
    const newColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    handleColorChange(newColor);
  };

  // Quick colors
  const quickColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B739', '#52C234', '#E74C3C', '#3498DB', '#9B59B6'
  ];

  if (compact) {
    // Compact version for collapsed sidebar
    return (
      <div className="space-y-3">
        {/* Current Color */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex-1">
            <div className="font-mono text-sm text-gray-900 dark:text-white">
              {currentColor.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getNoteFromFrequency(getFrequencyFromColor(currentColor))}
            </div>
          </div>
        </div>

        {/* Quick Colors */}
        <div className="grid grid-cols-5 gap-1">
          {quickColors.slice(0, 10).map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-6 h-6 rounded-full border border-white shadow-sm hover:scale-110 transition-transform ${
                currentColor === color ? 'ring-2 ring-indigo-500' : ''
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    );
  }

  // Full version for expanded sidebar
  return (
    <div className="space-y-4">
      {/* Current Color Display */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div
          className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
          style={{ backgroundColor: currentColor }}
        />
        <div className="flex-1">
          <div className="font-mono text-sm font-bold text-gray-900 dark:text-white">
            {currentColor.toUpperCase()}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getNoteFromFrequency(getFrequencyFromColor(currentColor))} • {Math.round(getFrequencyFromColor(currentColor))}Hz
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            HSL({hsl.h}°, {hsl.s}%, {hsl.l}%)
          </div>
        </div>
      </div>

      {/* Native Color Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Color Picker
        </label>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-full h-12 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
        />
      </div>

      {/* HSL Controls */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Fine Tune (HSL)
        </label>
        
        {/* Hue */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Hue</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{hsl.h}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={hsl.h}
            onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
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

        {/* Saturation */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Saturation</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{hsl.s}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={hsl.s}
            onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Lightness */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">Lightness</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{hsl.l}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={hsl.l}
            onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Quick Colors */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Quick Colors
        </label>
        <div className="grid grid-cols-8 gap-2">
          {quickColors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform ${
                currentColor === color ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
