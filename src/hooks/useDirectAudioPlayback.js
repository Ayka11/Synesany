import { useState, useRef, useEffect, useCallback } from "react";
import { getRealisticFrequency, getInstrumentHarmonics } from './useDrawing';

// Musical note frequencies (A4 = 440Hz tuning)
const noteFrequencies = {
  'C0': 16.35, 'C#0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'E0': 20.60, 'F0': 21.83,
  'F#0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'B0': 30.87,
  'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65,
  'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
  'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
  'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
  'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91,
  'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
  'C7': 2093.00, 'C#7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'E7': 2637.02, 'F7': 2793.83,
  'F#7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'B7': 3951.07,
  'C8': 4186.01
};

// Realistic instrument frequency ranges and characteristics
const instrumentProfiles = {
  piano: {
    name: 'Piano',
    fundamentalRange: { min: 27.5, max: 4186.01 }, // A0 to C8
    harmonics: [1, 2, 3, 4, 5, 6, 7, 8],
    harmonicStrengths: [1.0, 0.6, 0.3, 0.2, 0.15, 0.1, 0.08, 0.05],
    envelope: { attack: 0.001, decay: 0.3, sustain: 0.4, release: 0.5 },
    waveform: 'sine',
    colorMapping: 'brightnessToPitch'
  },
  
  guitar: {
    name: 'Guitar',
    fundamentalRange: { min: 82.41, max: 1174.66 }, // E2 to D5
    harmonics: [1, 2, 3, 4, 5, 6],
    harmonicStrengths: [1.0, 0.8, 0.4, 0.3, 0.2, 0.1],
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.3, release: 0.3 },
    waveform: 'sawtooth',
    colorMapping: 'hueToPitch'
  },
  
  violin: {
    name: 'Violin',
    fundamentalRange: { min: 196.00, max: 3520.00 }, // G3 to A7
    harmonics: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    harmonicStrengths: [1.0, 0.7, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1, 0.08],
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.3 },
    waveform: 'triangle',
    colorMapping: 'hueToPitch'
  },
  
  trumpet: {
    name: 'Trumpet',
    fundamentalRange: { min: 164.81, max: 988.00 }, // E3 to B5
    harmonics: [1, 2, 3, 4, 5, 6],
    harmonicStrengths: [1.0, 0.5, 0.8, 0.3, 0.6, 0.2],
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.2 },
    waveform: 'square',
    colorMapping: 'brightnessToLoudness'
  },
  
  drums: {
    name: 'Drums',
    fundamentalRange: { min: 30, max: 500 },
    harmonics: [1],
    harmonicStrengths: [1.0],
    envelope: { attack: 0.001, decay: 0.05, sustain: 0.0, release: 0.1 },
    waveform: 'square',
    colorMapping: 'saturationToPitch'
  },
  
  synth: {
    name: 'Synthesizer',
    fundamentalRange: { min: 20, max: 4000 },
    harmonics: [1, 2, 3, 4, 5],
    harmonicStrengths: [1.0, 0.7, 0.5, 0.3, 0.2],
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 0.3 },
    waveform: 'sawtooth',
    colorMapping: 'rgbToFrequency'
  }
};

// Helper functions for realistic frequency mapping
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

const quantizeToNote = (frequency) => {
  let closestNote = 440;
  let minDistance = Math.abs(frequency - 440);
  
  for (const [note, noteFreq] of Object.entries(noteFrequencies)) {
    const distance = Math.abs(frequency - noteFreq);
    if (distance < minDistance) {
      minDistance = distance;
      closestNote = noteFreq;
    }
  }
  
  return closestNote;
};

// Color to frequency mapping functions for different instruments
const colorToFrequencyMappings = {
  // Brightness-based mapping (good for piano, trumpet)
  brightnessToPitch: (r, g, b, instrumentProfile) => {
    const brightness = (r + g + b) / 3;
    const normalizedBrightness = brightness / 255;
    
    const { min, max } = instrumentProfile.fundamentalRange;
    const frequency = min + (max - min) * normalizedBrightness;
    
    return quantizeToNote(frequency);
  },
  
  // Hue-based mapping (good for guitar, violin)
  hueToPitch: (r, g, b, instrumentProfile) => {
    const hsl = rgbToHsl(r, g, b);
    const hue = hsl.h;
    
    const octave = Math.floor((hue / 360) * 7) + 1;
    const noteIndex = Math.floor((hue / 360) * 12);
    
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteName = noteNames[noteIndex] + octave;
    
    return noteFrequencies[noteName] || 440;
  },
  
  // Saturation-based mapping (good for drums)
  saturationToPitch: (r, g, b, instrumentProfile) => {
    const hsl = rgbToHsl(r, g, b);
    const saturation = hsl.s;
    
    if (saturation < 20) return 60;
    if (saturation < 40) return 200;
    if (saturation < 60) return 800;
    if (saturation < 80) return 1200;
    return 2000;
  },
  
  // RGB to frequency mapping (good for synth)
  rgbToFrequency: (r, g, b, instrumentProfile) => {
    const rFreq = (r / 255) * 1000;
    const gFreq = (g / 255) * 2000;
    const bFreq = (b / 255) * 4000;
    
    const combinedFreq = (rFreq + gFreq + bFreq) / 3;
    
    const { min, max } = instrumentProfile.fundamentalRange;
    return Math.max(min, Math.min(max, combinedFreq));
  },
  
  // Brightness to loudness mapping (good for trumpet)
  brightnessToLoudness: (r, g, b, instrumentProfile) => {
    const brightness = (r + g + b) / 3;
    const normalizedBrightness = brightness / 255;
    
    const { min, max } = instrumentProfile.fundamentalRange;
    const baseFrequency = (min + max) / 2;
    
    const modulation = (normalizedBrightness - 0.5) * 200;
    return baseFrequency + modulation;
  }
};

// Generate audio from canvas data
export const useDirectAudioPlayback = (canvasRef, sonificationMode, currentInstrument, masterVolume, adsr) => {
  const sampleRate = 44100;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }
  }, []);

  // Generate audio from canvas data
  const generateAudioFromCanvas = useCallback(async () => {
    const canvas = canvasRef?.current;
    if (!canvas || !audioContextRef.current) {
      console.warn('Canvas or audio context not available');
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Could not get canvas context');
      return null;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData || !imageData.data || imageData.data.length === 0) {
      console.warn('No image data available from canvas');
      return null;
    }

    const audioContext = audioContextRef.current;

    // Process canvas data based on sonification mode
    let audioBuffer;
    const totalDuration = 10; // 10 seconds of audio

    switch (sonificationMode) {
      case 'simple':
        audioBuffer = generateSimpleModeAudio(imageData, canvas, sampleRate, totalDuration);
        break;
      case 'timeline':
        audioBuffer = generateTimelineModeAudio(imageData, canvas, sampleRate, totalDuration);
        break;
      case 'colorfield':
        audioBuffer = generateColorFieldModeAudio(imageData, canvas, sampleRate, totalDuration);
        break;
      case 'harmonic':
        audioBuffer = generateHarmonicModeAudio(imageData, canvas, sampleRate, totalDuration);
        break;
      default:
        audioBuffer = generateSimpleModeAudio(imageData, canvas, sampleRate, totalDuration);
    }

    setDuration(totalDuration);
    return audioBuffer;
  }, [canvasRef, sonificationMode, sampleRate]);

  // Simple mode: color brightness to frequency with realistic mapping
  const generateSimpleModeAudio = (imageData, canvas, sampleRate, duration) => {
    const samples = sampleRate * duration;
    const buffer = new Float32Array(samples);
    const pixelsPerSample = Math.max(1, Math.floor((canvas.width * canvas.height) / samples));
    
    for (let i = 0; i < samples; i++) {
      // Sample multiple pixels per audio sample for better representation
      const sampleIndex = Math.floor((i / samples) * (canvas.width * canvas.height / pixelsPerSample));
      const pixelIndex = sampleIndex * pixelsPerSample;
      
      let totalBrightness = 0;
      let validPixels = 0;
      
      for (let p = 0; p < pixelsPerSample && (pixelIndex + p) < (canvas.width * canvas.height); p++) {
        const idx = (pixelIndex + p) * 4;
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        const a = imageData.data[idx + 3];
        
        if (a > 0) {
          totalBrightness += (r + g + b) / 3;
          validPixels++;
        }
      }
      
      const brightness = validPixels > 0 ? totalBrightness / validPixels : 0;
      
      // Use realistic frequency mapping like real-time audio
      const frequency = getRealisticFrequency(
        Math.floor(brightness),
        Math.floor(brightness), 
        Math.floor(brightness), 
        currentInstrument
      );
      
      const t = i / sampleRate;
      
      // Apply envelope for smoother sound
      const envelope = Math.sin(Math.PI * (i / samples)) * 0.5 + 0.5;
      buffer[i] = Math.sin(2 * Math.PI * frequency * t) * 0.3 * envelope;
    }
    
    return buffer;
  };

  // Timeline mode: vertical position + stereo panning with realistic mapping
  const generateTimelineModeAudio = (imageData, canvas, sampleRate, duration) => {
    const samples = sampleRate * duration;
    const buffer = new Float32Array(samples);
    const pixelsPerSample = Math.max(1, Math.floor((canvas.width * canvas.height) / samples));
    
    for (let i = 0; i < samples; i++) {
      // Sample multiple pixels per audio sample
      const sampleIndex = Math.floor((i / samples) * (canvas.width * canvas.height / pixelsPerSample));
      const pixelIndex = sampleIndex * pixelsPerSample;
      
      let totalBrightness = 0;
      let validPixels = 0;
      let avgY = 0;
      let avgX = 0;
      
      for (let p = 0; p < pixelsPerSample && (pixelIndex + p) < (canvas.width * canvas.height); p++) {
        const pixelIdx = (pixelIndex + p);
        const x = pixelIdx % canvas.width;
        const y = Math.floor(pixelIdx / canvas.width);
        const idx = pixelIdx * 4;
        
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        const a = imageData.data[idx + 3];
        
        if (a > 0) {
          totalBrightness += (r + g + b) / 3;
          avgY += y;
          avgX += x;
          validPixels++;
        }
      }
      
      const brightness = validPixels > 0 ? totalBrightness / validPixels : 0;
      const finalY = validPixels > 0 ? avgY / validPixels : canvas.height / 2;
      const finalX = validPixels > 0 ? avgX / validPixels : canvas.width / 2;
      
      // Use realistic frequency mapping like real-time audio
      const baseFrequency = getRealisticFrequency(
        Math.floor(brightness),
        Math.floor(brightness), 
        Math.floor(brightness), 
        currentInstrument
      );
      
      // Timeline mode: frequency based on vertical position
      const frequency = baseFrequency * Math.pow(2, (1 - finalY / canvas.height) * 3);
      const t = i / samples;
      
      const brightnessMod = 1 + (brightness / 255) * 0.5;
      
      buffer[i] = Math.sin(2 * Math.PI * frequency * t * brightnessMod) * 0.3;
    }
    
    return buffer;
  };

  // Color Field mode: spatial frequency mapping
  const generateColorFieldModeAudio = (imageData, canvas, sampleRate, duration) => {
    const samples = sampleRate * duration;
    const buffer = new Float32Array(samples);
    const pixelsPerSample = Math.max(1, Math.floor((canvas.width * canvas.height) / samples));
    
    for (let i = 0; i < samples; i++) {
      // Sample multiple pixels per audio sample
      const sampleIndex = Math.floor((i / samples) * (canvas.width * canvas.height / pixelsPerSample));
      const pixelIndex = sampleIndex * pixelsPerSample;
      
      let totalBrightness = 0;
      let validPixels = 0;
      let avgX = 0;
      
      for (let p = 0; p < pixelsPerSample && (pixelIndex + p) < (canvas.width * canvas.height); p++) {
        const pixelIdx = (pixelIndex + p);
        const x = pixelIdx % canvas.width;
        const idx = pixelIdx * 4;
        
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        const a = imageData.data[idx + 3];
        
        if (a > 0) {
          totalBrightness += (r + g + b) / 3;
          avgX += x;
          validPixels++;
        }
      }
      
      const brightness = validPixels > 0 ? totalBrightness / validPixels : 0;
      const finalX = validPixels > 0 ? avgX / validPixels : canvas.width / 2;
      
      // Color brightness + spatial variation with realistic frequencies
      const baseFrequency = getRealisticFrequency(r, g, b, currentInstrument);
      const spatialModulation = (finalX / canvas.width) * 300;
      const frequency = baseFrequency + spatialModulation;
      const t = i / sampleRate;
      
      // Add subtle color-based modulation
      const colorMod = 1 + (brightness / 255) * 0.3;
      
      buffer[i] = Math.sin(2 * Math.PI * frequency * t * colorMod) * 0.3;
    }
    
    return buffer;
  };

  // Harmonic mode: musical frequency generation
  const generateHarmonicModeAudio = (imageData, canvas, sampleRate, duration) => {
    const samples = sampleRate * duration;
    const buffer = new Float32Array(samples);
    const pixelsPerSample = Math.max(1, Math.floor((canvas.width * canvas.height) / samples));
    
    for (let i = 0; i < samples; i++) {
      // Sample multiple pixels per audio sample
      const sampleIndex = Math.floor((i / samples) * (canvas.width * canvas.height / pixelsPerSample));
      const pixelIndex = sampleIndex * pixelsPerSample;
      
      let totalBrightness = 0;
      let validPixels = 0;
      
      for (let p = 0; p < pixelsPerSample && (pixelIndex + p) < (canvas.width * canvas.height); p++) {
        const idx = (pixelIndex + p) * 4;
        
        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];
        const a = imageData.data[idx + 3];
        
        if (a > 0) {
          totalBrightness += (r + g + b) / 3;
          validPixels++;
        }
      }
      
      const brightness = validPixels > 0 ? totalBrightness / validPixels : 0;
      
      // Map to musical frequencies with realistic instrument ranges
      const profile = instrumentProfiles[currentInstrument] || instrumentProfiles.piano;
      const { min, max } = profile.fundamentalRange;
      const frequency = min + (brightness / 255) * (max - min);
      const quantizedFreq = quantizeToNote(frequency);
      const t = i / sampleRate;
      
      // Add realistic instrument harmonics
      const harmonics = getInstrumentHarmonics(quantizedFreq, currentInstrument);
      let sample = 0;
      
      for (const harmonic of harmonics) {
        sample += Math.sin(2 * Math.PI * harmonic.frequency * t) * harmonic.amplitude;
      }
      
      // Apply envelope for musical phrasing
      const envelope = Math.sin(Math.PI * (i / samples)) * 0.6 + 0.4;
      buffer[i] = sample * 0.25 * envelope;
    }
    
    return buffer;
  };

  // Play audio buffer
  const playAudioBuffer = useCallback(async (audioBuffer) => {
    if (!audioContextRef.current || !audioBuffer) {
      console.warn('Audio context or buffer not available');
      return;
    }

    const audioContext = audioContextRef.current;
    
    // Stop current playback if any
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch (e) {
        console.warn('Error stopping previous audio:', e);
      }
    }

    // Create new audio buffer source
    const source = audioContext.createBufferSource();
    const buffer = audioContext.createBuffer(1, audioBuffer.length, sampleRate);
    buffer.copyToChannel(audioBuffer, 0);
    
    source.buffer = buffer;
    source.loop = false;
    
    // Apply ADSR envelope using gain node
    const gainNode = audioContext.createGain();
    
    // Map instrument to waveform characteristics
    const instrumentSettings = {
      'piano': { gain: 0.8, attack: 0.1, decay: 0.2, release: 0.3 },
      'guitar': { gain: 0.7, attack: 0.05, decay: 0.15, release: 0.25 },
      'violin': { gain: 0.6, attack: 0.2, decay: 0.3, release: 0.4 },
      'trumpet': { gain: 0.9, attack: 0.02, decay: 0.1, release: 0.2 },
      'drums': { gain: 1.0, attack: 0.01, decay: 0.05, release: 0.1 },
      'synth': { gain: 0.7, attack: 0.05, decay: 0.2, release: 0.3 }
    };
    
    const settings = instrumentSettings[currentInstrument] || instrumentSettings.piano;
    const now = audioContext.currentTime;
    const startTime = now;
    
    // Apply ADSR envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(settings.gain * masterVolume, now + settings.attack);
    gainNode.gain.linearRampToValueAtTime(settings.gain * masterVolume * (adsr?.sustain ?? 0.7), now + settings.attack + (adsr?.decay ?? settings.decay));
    gainNode.gain.linearRampToValueAtTime(0, now + settings.attack + (adsr?.decay ?? settings.decay) + duration + (adsr?.release ?? settings.release));
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start playback
    source.start(0);
    sourceRef.current = source;
    
    // Update time tracking with proper reference
    const updateTime = () => {
      if (sourceRef.current && audioContext.currentTime - startTime < duration) {
        setCurrentTime(audioContext.currentTime - startTime);
        animationRef.current = requestAnimationFrame(updateTime);
      } else {
        setIsPlaying(false);
        setCurrentTime(duration); // Ensure we show full duration at end
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    };
    
    setIsPlaying(true);
    setCurrentTime(0); // Reset to start
    animationRef.current = requestAnimationFrame(updateTime);
  }, [currentInstrument, masterVolume, adsr, duration, sampleRate]);

  // Stop playback
  const stopPlayback = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch (e) {
        console.warn('Error stopping audio:', e);
      }
      sourceRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  // Main play function
  const playSound = useCallback(async () => {
    if (!audioContextRef.current) {
      initAudioContext();
    }
    
    try {
      const audioBuffer = await generateAudioFromCanvas();
      if (audioBuffer) {
        await playAudioBuffer(audioBuffer);
      } else {
        console.warn('No audio buffer generated');
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      setIsPlaying(false);
    }
  }, [generateAudioFromCanvas, playAudioBuffer, initAudioContext]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    stopPlayback();
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  }, [stopPlayback]);

  // Download audio as WAV file
  const downloadAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      initAudioContext();
    }
    
    try {
      const audioBuffer = await generateAudioFromCanvas();
      if (!audioBuffer) {
        console.warn('No audio buffer generated for download');
        return;
      }

      // Convert Float32Array to WAV buffer
      const length = audioBuffer.length;
      const wavBuffer = new ArrayBuffer(44 + length * 2);
      const view = new DataView(wavBuffer);
      
      // WAV header
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };
      
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + length * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, length * 2, true);
      
      // Convert float samples to 16-bit PCM
      let offset = 44;
      for (let i = 0; i < length; i++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
      
      // Create download link
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `synesthetica-${sonificationMode}-${currentInstrument}-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Audio downloaded successfully');
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  }, [generateAudioFromCanvas, initAudioContext, sonificationMode, currentInstrument, sampleRate]);

  return {
    isPlaying,
    currentTime,
    duration,
    playSound,
    stopPlayback,
    downloadAudio,
    initAudioContext,
    cleanup
  };
};
