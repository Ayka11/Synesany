import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { 
  getFrequencyFromHsl, 
  hslToRgb, 
  hslToHex, 
  getNoteFromFrequency, 
  getClosestNote 
} from '@/utils/colorUtils';
import { audioEngine } from '@/lib/audioEngine';

interface ColorWheelPickerProps {
  currentColor: string;
  onColorChange: (hex: string) => void;
  className?: string;
}

export default function ColorWheelPicker({
  currentColor,
  onColorChange,
  className = '',
}: ColorWheelPickerProps) {
  const [hue, setHue] = useState(0);           // 0–360
  const [saturation, setSaturation] = useState(100); // 0–100
  const [lightness, setLightness] = useState(50);    // 0–100
  const [previewFreq, setPreviewFreq] = useState(440);
  const [previewNote, setPreviewNote] = useState('A4');

  const wheelRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  // Sync with external currentColor (if changed outside)
  useEffect(() => {
    const hex = currentColor.startsWith('#') ? currentColor : '#000000';
    const r = parseInt(hex.slice(1,3),16)/255;
    const g = parseInt(hex.slice(3,5),16)/255;
    const b = parseInt(hex.slice(5,7),16)/255;

    const max = Math.max(r,g,b);
    const min = Math.min(r,g,b);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h *= 60;
      if (h < 0) h += 360;
    }

    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    setHue(Math.round(h));
    setSaturation(Math.round(s * 100));
    setLightness(Math.round(l * 100));
  }, [currentColor]);

  // Update frequency & note preview when HSL changes
  useEffect(() => {
    const freq = getFrequencyFromHsl(hue, saturation, lightness);
    setPreviewFreq(Math.round(freq));
    setPreviewNote(getClosestNote(freq));
  }, [hue, saturation, lightness]);

  const hex = hslToHex(hue, saturation, lightness);

  const playPreview = () => {
    audioEngine.playTone(previewFreq, 0.6, 0.1); // short tone preview
  };

  const handleWheelClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wheelRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const radius = rect.width / 2;

    if (distance > radius * 0.8) return; // outside wheel

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    setHue(Math.round(angle));
  };

  const handleSquareClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = squareRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const s = Math.round((x / rect.width) * 100);
    const l = Math.round(100 - (y / rect.height) * 100);

    setSaturation(Math.max(0, Math.min(100, s)));
    setLightness(Math.max(0, Math.min(100, l)));
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Header with current color & frequency info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg border border-border shadow-inner"
            style={{ backgroundColor: hex }}
          />
          <div>
            <div className="text-sm font-medium">{hex.toUpperCase()}</div>
            <div className="text-xs text-muted-foreground">
              {previewNote} • {previewFreq} Hz
            </div>
          </div>
        </div>
        <button
          onClick={playPreview}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          title="Preview sound"
        >
          <Play className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Color wheel */}
      <div 
        ref={wheelRef}
        onClick={handleWheelClick}
        className="
          relative w-full aspect-square rounded-full cursor-pointer
          border-8 border-background shadow-inner overflow-hidden
          bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 via-pink-500 to-red-500
        "
      >
        {/* Hue indicator */}
        <div 
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg pointer-events-none"
          style={{
            top: `${50 - 45 * Math.sin((hue * Math.PI) / 180)}%`,
            left: `${50 + 45 * Math.cos((hue * Math.PI) / 180)}%`,
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
          }}
        />
      </div>

      {/* Saturation × Lightness square */}
      <div 
        ref={squareRef}
        onClick={handleSquareClick}
        className="
          relative w-full aspect-square rounded-xl cursor-pointer overflow-hidden
          border border-border shadow-inner
        "
        style={{
          background: `linear-gradient(to top, black, transparent), linear-gradient(to right, gray, hsl(${hue}, 100%, 50%))`
        }}
      >
        {/* SL indicator */}
        <div 
          className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg pointer-events-none"
          style={{
            left: `${saturation}%`,
            top: `${100 - lightness}%`,
            backgroundColor: hex,
          }}
        />
      </div>

      {/* Current hex + note info */}
      <div className="text-center text-sm text-muted-foreground">
        Hue: {hue}° • Sat: {saturation}% • Light: {lightness}%
      </div>

      {/* Apply button */}
      <button
        onClick={() => onColorChange(hex)}
        className="
          w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium
          hover:brightness-110 transition-all active:scale-98
        "
      >
        Apply Color
      </button>
    </div>
  );
}
