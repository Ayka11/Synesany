import { useCallback } from "react";

// Import realistic frequency mapping functions (we'll need to extract these from useDirectAudioPlayback)
export const getRealisticFrequency = (r, g, b, instrumentType) => {
  // Simplified version for useDrawing - will be enhanced
  const brightness = (r + g + b) / 3;
  const normalizedBrightness = brightness / 255;
  
  // Instrument frequency ranges
  const instrumentRanges = {
    piano: { min: 27.5, max: 4186.01 },
    guitar: { min: 82.41, max: 1174.66 },
    violin: { min: 196.00, max: 3520.00 },
    trumpet: { min: 164.81, max: 988.00 },
    drums: { min: 30, max: 500 },
    synth: { min: 20, max: 4000 }
  };
  
  const range = instrumentRanges[instrumentType] || instrumentRanges.piano;
  return range.min + (range.max - range.min) * normalizedBrightness;
};

const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  
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
  
  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
};

// Brush timbre to audio characteristics mapping
const getBrushAudioCharacteristics = (brushType) => {
  const characteristics = {
    round: { waveform: 'sine', harmonics: 1, brightness: 1.0, attack: 0.1 },
    square: { waveform: 'square', harmonics: 0.7, brightness: 1.2, attack: 0.05 },
    spray: { waveform: 'triangle', harmonics: 0.5, brightness: 0.8, attack: 0.2 },
    star: { waveform: 'sawtooth', harmonics: 1.5, brightness: 1.3, attack: 0.02 },
    cross: { waveform: 'square', harmonics: 0.3, brightness: 0.9, attack: 0.001 },
    triangle: { waveform: 'triangle', harmonics: 0.6, brightness: 0.7, attack: 0.15 },
    sawtooth: { waveform: 'sawtooth', harmonics: 1.8, brightness: 1.4, attack: 0.03 },
    calligraphy: { waveform: 'sine', harmonics: 1.2, brightness: 1.1, attack: 0.08 },
    marker: { waveform: 'square', harmonics: 0.9, brightness: 1.5, attack: 0.01 },
    pencil: { waveform: 'sine', harmonics: 0.4, brightness: 0.6, attack: 0.25 }
  };
  
  return characteristics[brushType] || characteristics.round;
};

// Instrument harmonics mapping
export const getInstrumentHarmonics = (instrumentType) => {
  const instrumentHarmonics = {
    piano: 1.0,
    guitar: 0.8,
    violin: 1.2,
    trumpet: 0.9,
    flute: 0.6,
    drums: 0.4,
    bass: 0.7,
    synth: 1.5
  };
  
  return instrumentHarmonics[instrumentType] || 1.0;
};

export const useDrawing = ({
  canvasRef,
  ctxRef,
  isDrawing,
  color,
  brushSize,
  brushType,
  instrument,
  attack,
  decay,
  sustain,
  release,
  playTone,
  saveHistory,
  getCoords,
  sonificationMode = 'timeline',
  onDrawingStart,
  onDrawingActivity,
  onDrawingEnd,
}) => {
  const startDrawing = useCallback(
    (e) => {
      const { x, y } = getCoords(e);
      isDrawing.current = true;
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x, y);
      
      // Notify drawing start for completion detection
      if (onDrawingStart) {
        onDrawingStart();
      }
      
      draw(e);
    },
    [getCoords, ctxRef, isDrawing, onDrawingStart],
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing.current) return;
      const { x, y } = getCoords(e);

      const ctx = ctxRef.current;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = brushSize;

      // Handle different brush types
      if (brushType === "spray") {
        for (let i = 0; i < brushSize; i++) {
          const offset = Math.random() * brushSize - brushSize / 2;
          const angle = Math.random() * Math.PI * 2;
          ctx.fillRect(
            x + Math.cos(angle) * offset,
            y + Math.sin(angle) * offset,
            1,
            1,
          );
        }
      } else if (brushType === "square") {
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (brushType === "triangle") {
        // Draw triangular brush strokes
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        const size = brushSize / 2;
        ctx.beginPath();
        ctx.moveTo(x - size, y + size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x, y - size);
        ctx.closePath();
        ctx.fill();
      } else if (brushType === "star") {
        // Draw star brush
        const spikes = 5;
        const outerRadius = brushSize / 2;
        const innerRadius = brushSize / 4;
        let rotation = Math.PI / 2 * 3;
        let xPoint = x;
        let yPoint = y;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < spikes; i++) {
          xPoint = x + Math.cos(rotation) * outerRadius;
          yPoint = y + Math.sin(rotation) * outerRadius;
          ctx.lineTo(xPoint, yPoint);
          rotation += step;

          xPoint = x + Math.cos(rotation) * innerRadius;
          yPoint = y + Math.sin(rotation) * innerRadius;
          ctx.lineTo(xPoint, yPoint);
          rotation += step;
        }
        ctx.lineTo(x, y - outerRadius);
        ctx.closePath();
        ctx.fill();
      } else if (brushType === "cross") {
        // Draw cross brush
        const size = brushSize / 2;
        ctx.fillRect(x - 1, y - size, 2, size * 2);
        ctx.fillRect(x - size, y - 1, size * 2, 2);
      } else if (brushType === "sawtooth") {
        // Draw jagged sawtooth pattern
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        const teeth = Math.floor(brushSize / 4);
        const toothSize = brushSize / teeth;
        
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
          const offset = i * toothSize;
          ctx.moveTo(x + offset, y + (i % 2 === 0 ? toothSize : -toothSize));
          ctx.lineTo(x + offset + toothSize, y + (i % 2 === 0 ? -toothSize : toothSize));
        }
        ctx.stroke();
      } else if (brushType === "calligraphy") {
        // Draw calligraphy brush with angled stroke
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = brushSize;
        ctx.globalAlpha = 0.8;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      } else if (brushType === "marker") {
        // Draw marker-like thick stroke
        ctx.lineCap = "square";
        ctx.lineJoin = "miter";
        ctx.lineWidth = brushSize * 1.5;
        ctx.globalAlpha = 0.9;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      } else if (brushType === "pencil") {
        // Draw pencil with texture
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = brushSize * 0.7;
        ctx.globalAlpha = 0.7;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      } else {
        // Default round brush
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Real-time Sound with selected instrument and ADSR envelope
      let frequency;
      const brushCharacteristics = getBrushAudioCharacteristics(brushType);
      
      // Get color data for frequency calculation
      const imageData = ctxRef.current.getImageData(Math.max(0, x - 1), Math.max(0, y - 1), 1, 1);
      const r = imageData.data[0];
      const g = imageData.data[1];
      const b = imageData.data[2];
      
      if (sonificationMode === 'timeline') {
        // Timeline mode: frequency based on vertical position with brush modification
        const baseFreq = 220 * Math.pow(2, (1 - y / canvasRef.current.height) * 3);
        frequency = baseFreq * brushCharacteristics.harmonics;
      } else if (sonificationMode === 'colorfield') {
        // Color Field mode: realistic frequency mapping with spatial variation
        const baseFrequency = getRealisticFrequency(r, g, b, instrument);
        const spatialModulation = (x / canvasRef.current.width) * 200;
        frequency = baseFrequency + spatialModulation;
      } else if (sonificationMode === 'harmonic') {
        // Harmonic mode: musical frequency mapping with brush harmonics
        const baseFrequency = getRealisticFrequency(r, g, b, instrument);
        frequency = baseFrequency * brushCharacteristics.harmonics;
      } else {
        // Simple mode: realistic frequency mapping with brush characteristics
        frequency = getRealisticFrequency(r, g, b, instrument) * brushCharacteristics.harmonics;
      }
      
      // Apply brush-specific brightness modification
      frequency *= brushCharacteristics.brightness;
      
      // Use brush-specific attack time
      const brushAttack = brushCharacteristics.attack;
      const noteDuration = brushAttack + decay + release;
      
      // In Color Harmony mode, center the panning
      const panPosition = sonificationMode === 'timeline' ? x / canvasRef.current.width : 0.5;
      
      // Notify drawing activity for completion detection
      if (onDrawingActivity) {
        onDrawingActivity();
      }
      
      playTone(frequency, instrument, noteDuration, panPosition, {
        attack: brushAttack,
        decay,
        sustain,
        release,
      });
    },
    [
      isDrawing,
      getCoords,
      ctxRef,
      color,
      brushSize,
      brushType,
      canvasRef,
      instrument,
      attack,
      decay,
      sustain,
      release,
      playTone,
      onDrawingActivity,
    ],
  );

  const stopDrawing = useCallback(() => {
    if (isDrawing.current) {
      isDrawing.current = false;
      saveHistory();
      
      // Notify drawing end for completion detection
      if (onDrawingEnd) {
        onDrawingEnd();
      }
    }
  }, [isDrawing, saveHistory, onDrawingEnd]);

  return {
    startDrawing,
    draw,
    stopDrawing,
  };
};
