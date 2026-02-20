// 88 Piano Notes with Rainbow Colors - Each octave has full rainbow spectrum
export const RAINBOW_PALETTE = {
  name: "Rainbow Spectrum",
  type: "full",
  notes: 88,
  data: [
    // Octave 0 (A0-G#0) - First 12 colors of rainbow
    { name: "A0", freq: 27.50, color: "rgb(197, 34, 0)", hex: "#C52200", note: "A0" },
    { name: "A#0", freq: 29.14, color: "rgb(255, 69, 0)", hex: "#FF4500", note: "A#" },
    { name: "B0", freq: 30.87, color: "rgb(204, 204, 0)", hex: "#CCCCCC", note: "B0" },
    { name: "C1", freq: 32.70, color: "rgb(102, 152, 0)", hex: "#669800", note: "C1" },
    { name: "C#1", freq: 34.65, color: "rgb(0, 100, 0)", hex: "#006400", note: "C#" },
    { name: "D1", freq: 36.71, color: "rgb(0, 50, 70)", hex: "#003246", note: "D1" },
    { name: "D#1", freq: 38.89, color: "rgb(0, 0, 139)", hex: "#00008B", note: "D#" },
    { name: "E1", freq: 41.20, color: "rgb(75, 0, 130)", hex: "#4B0082", note: "E1" },
    { name: "F1", freq: 43.65, color: "rgb(112, 0, 171)", hex: "#7000AB", note: "F1" },
    { name: "F#1", freq: 46.25, color: "rgb(148, 0, 211)", hex: "#9400D3", note: "F#" },
    { name: "G1", freq: 49.00, color: "rgb(157, 0, 106)", hex: "#9D006A", note: "G1" },
    { name: "G#1", freq: 51.91, color: "rgb(165, 0, 0)", hex: "#A50000", note: "G#" },
    // Octave 1 (A1-G#1) - Next 12 colors
    { name: "A1", freq: 55.00, color: "rgb(210, 0, 128)", hex: "#D20080", note: "A1" },
    { name: "A#1", freq: 58.27, color: "rgb(255, 94, 0)", hex: "#FF5E00", note: "A#" },
    { name: "B1", freq: 61.74, color: "rgb(221, 221, 0)", hex: "#DDDD00", note: "B1" },
    { name: "C2", freq: 65.41, color: "rgb(111, 175, 0)", hex: "#6FAF00", note: "C2" },
    { name: "C#2", freq: 69.30, color: "rgb(0, 128, 0)", hex: "#008000", note: "C#" },
    { name: "D2", freq: 73.42, color: "rgb(0, 64, 85)", hex: "#004055", note: "D2" },
    { name: "D#2", freq: 77.78, color: "rgb(0, 0, 170)", hex: "#0000AA", note: "D#" },
    { name: "E2", freq: 82.41, color: "rgb(92, 0, 159)", hex: "#5C009F", note: "E2" },
    { name: "F2", freq: 87.31, color: "rgb(119, 0, 96)", hex: "#770060", note: "F2" },
    { name: "F#2", freq: 92.50, color: "rgb(159, 0, 226)", hex: "#9F00E2", note: "F#" },
    { name: "G2", freq: 98.00, color: "rgb(175, 0, 113)", hex: "#AF0071", note: "G2" },
    { name: "G#2", freq: 103.83, color: "rgb(191, 0, 0)", hex: "#BF0000", note: "G#" },
    // Octave 2 (A2-G#2) - Next 12 colors
    { name: "A2", freq: 110.00, color: "rgb(224, 60, 128)", hex: "#E03C80", note: "A2" },
    { name: "A#2", freq: 116.54, color: "rgb(255, 119, 0)", hex: "#FF7700", note: "A#" },
    { name: "B2", freq: 123.47, color: "rgb(238, 238, 0)", hex: "#EEEE00", note: "B2" },
    { name: "C3", freq: 130.81, color: "rgb(119, 159, 0)", hex: "#779F00", note: "C3" },
    { name: "C#3", freq: 138.59, color: "rgb(0, 160, 0)", hex: "#00A000", note: "C#" },
    { name: "D3", freq: 146.83, color: "rgb(0, 80, 100)", hex: "#005064", note: "D3" },
    { name: "D#3", freq: 155.56, color: "rgb(0, 0, 200)", hex: "#0000C8", note: "D#" },
    { name: "E3", freq: 164.81, color: "rgb(109, 0, 188)", hex: "#6D00BC", note: "E3" },
    { name: "F3", freq: 174.61, color: "rgb(140, 0, 215)", hex: "#8C00D7", note: "F3" },
    { name: "F#3", freq: 185.00, color: "rgb(170, 0, 241)", hex: "#AA00F1", note: "F#" },
    { name: "G3", freq: 196.00, color: "rgb(194, 0, 121)", hex: "#C20079", note: "G3" },
    { name: "G#3", freq: 207.65, color: "rgb(217, 0, 0)", hex: "#D90000", note: "G#" },
    // Octave 3 (A3-G#3) - Next 12 colors
    { name: "A3", freq: 220.00, color: "rgb(236, 72, 0)", hex: "#EC4800", note: "A3" },
    { name: "A#3", freq: 233.08, color: "rgb(255, 144, 0)", hex: "#FF9000", note: "A#" },
    { name: "B3", freq: 246.94, color: "rgb(255, 255, 0)", hex: "#FFFF00", note: "B3" },
    { name: "C4", freq: 261.63, color: "rgb(128, 224, 0)", hex: "#80E000", note: "C4" },
    { name: "C#4", freq: 277.18, color: "rgb(0, 192, 0)", hex: "#00C000", note: "C#" },
    { name: "D4", freq: 293.66, color: "rgb(0, 96, 115)", hex: "#006073", note: "D4" },
    { name: "D#4", freq: 311.13, color: "rgb(0, 0, 230)", hex: "#0000E6", note: "D#" },
    { name: "E4", freq: 329.63, color: "rgb(126, 0, 217)", hex: "#7E00D9", note: "E4" },
    { name: "F4", freq: 349.23, color: "rgb(159, 26, 236)", hex: "#9F1AEC", note: "F4" },
    { name: "F#4", freq: 369.99, color: "rgb(191, 51, 255)", hex: "#BF33FF", note: "F#" },
    { name: "G4", freq: 392.00, color: "rgb(217, 26, 128)", hex: "#D91A80", note: "G4" },
    { name: "G#4", freq: 415.30, color: "rgb(243, 0, 0)", hex: "#F30000", note: "G#" },
    // Octave 4 (A4-G#4) - Next 12 colors
    { name: "A4", freq: 440.00, color: "rgb(249, 85, 0)", hex: "#F95500" },
    { name: "A#4", freq: 466.16, color: "rgb(255, 169, 0)", hex: "#FFA900" },
    { name: "B4", freq: 493.88, color: "rgb(255, 255, 51)", hex: "#FFFF33" },
    { name: "C5", freq: 523.25, color: "rgb(128, 240, 26)", hex: "#80F01A" },
    { name: "C#5", freq: 554.37, color: "rgb(0, 224, 0)", hex: "#00E000" },
    { name: "D5", freq: 587.33, color: "rgb(26, 138, 128)", hex: "#1A8A80" },
    { name: "D#5", freq: 622.25, color: "rgb(51, 51, 255)", hex: "#3333FF" },
    { name: "E5", freq: 659.25, color: "rgb(143, 51, 229)", hex: "#8F33E5" },
    { name: "F5", freq: 698.46, color: "rgb(178, 77, 242)", hex: "#B24DF2" },
    { name: "F#5", freq: 739.99, color: "rgb(213, 102, 255)", hex: "#D566FF" },
    { name: "G5", freq: 783.99, color: "rgb(234, 77, 153)", hex: "#EA4D99" },
    { name: "G#5", freq: 830.61, color: "rgb(255, 51, 51)", hex: "#FF3333" },
    // Octave 5 (A5-G#5) - Next 12 colors
    { name: "A5", freq: 880.00, color: "rgb(255, 123, 77)", hex: "#FF7B4D" },
    { name: "A#5", freq: 932.33, color: "rgb(255, 194, 102)", hex: "#FFC266" },
    { name: "B5", freq: 987.77, color: "rgb(255, 255, 102)", hex: "#FFFF66" },
    { name: "C6", freq: 1046.50, color: "rgb(179, 255, 102)", hex: "#B3FF66" },
    { name: "C#6", freq: 1108.73, color: "rgb(102, 255, 102)", hex: "#66FF66" },
    { name: "D6", freq: 1174.66, color: "rgb(102, 179, 179)", hex: "#66B3B3" },
    { name: "D#6", freq: 1244.51, color: "rgb(102, 102, 255)", hex: "#6666FF" },
    { name: "E6", freq: 1318.51, color: "rgb(170, 102, 242)", hex: "#AA66F2" },
    { name: "F6", freq: 1396.91, color: "rgb(202, 128, 249)", hex: "#CA80F9" },
    { name: "F#6", freq: 1479.98, color: "rgb(234, 153, 255)", hex: "#EA99FF" },
    { name: "G6", freq: 1567.98, color: "rgb(245, 128, 179)", hex: "#F580B3" },
    { name: "G#6", freq: 1661.22, color: "rgb(255, 102, 102)", hex: "#FF6666" },
    // Octave 6 (A6-G#6) - Next 12 colors
    { name: "A6", freq: 1760.00, color: "rgb(255, 161, 128)", hex: "#FFA180" },
    { name: "A#6", freq: 1864.66, color: "rgb(255, 219, 153)", hex: "#FFDB99" },
    { name: "B6", freq: 1975.53, color: "rgb(255, 255, 153)", hex: "#FFFF99" },
    { name: "C7", freq: 2093.00, color: "rgb(204, 255, 153)", hex: "#CCFF99" },
    { name: "C#7", freq: 2217.46, color: "rgb(153, 255, 153)", hex: "#99FF99" },
    { name: "D7", freq: 2349.32, color: "rgb(153, 204, 204)", hex: "#99CCCC" },
    { name: "D#7", freq: 2489.02, color: "rgb(153, 153, 255)", hex: "#9999FF" },
    { name: "E7", freq: 2637.02, color: "rgb(197, 153, 255)", hex: "#C599FF" },
    { name: "F7", freq: 2793.83, color: "rgb(222, 176, 255)", hex: "#DEB0FF" },
    { name: "F#7", freq: 2959.96, color: "rgb(246, 198, 255)", hex: "#F6C6FF" },
    { name: "G7", freq: 3135.96, color: "rgb(251, 176, 204)", hex: "#FBB0CC" },
    { name: "G#7", freq: 3322.44, color: "rgb(255, 153, 153)", hex: "#FF9999" },
    // Octave 7 (A7-G#7) - Next 12 colors
    { name: "A7", freq: 3520.00, color: "rgb(255, 194, 176)", hex: "#FFC2B0" },
    { name: "A#7", freq: 3729.31, color: "rgb(255, 234, 198)", hex: "#FFEAC6" },
    { name: "B7", freq: 3951.07, color: "rgb(255, 255, 204)", hex: "#FFFFCC" },
    { name: "C8", freq: 4186.01, color: "rgb(255, 255, 230)", hex: "#FFFFE6" }
  ]
};

// Solar Flare Palette with Frequency Mapping
export const SOLAR_FLARE_PALETTE = {
  name: "Solar Flare",
  type: "curated",
  notes: 10,
  data: [
    {
      name: "Solar Flare",
      hex: "#FF6F3C",
      closestNote: "C#2",
      frequency: 69.30,
      huePosition: 18,
      rgb: [255, 111, 60]
    },
    {
      name: "Golden Ember",
      hex: "#F9C74F",
      closestNote: "F3",
      frequency: 174.61,
      huePosition: 45,
      rgb: [249, 199, 79]
    },
    {
      name: "Verdant Glow",
      hex: "#90BE6D",
      closestNote: "A4",
      frequency: 440.00,
      huePosition: 120,
      rgb: [144, 190, 109]
    },
    {
      name: "Ocean Depth",
      hex: "#277DA1",
      closestNote: "D#5",
      frequency: 622.25,
      huePosition: 200,
      rgb: [39, 125, 161]
    },
    {
      name: "Twilight Violet",
      hex: "#6A4C93",
      closestNote: "G#5",
      frequency: 830.61,
      huePosition: 270,
      rgb: [106, 76, 147]
    },
    {
      name: "Crimson Pulse",
      hex: "#D62828",
      closestNote: "C6",
      frequency: 1046.50,
      huePosition: 0,
      rgb: [214, 40, 40]
    },
    {
      name: "Misty Rose",
      hex: "#F7BFB4",
      closestNote: "E6",
      frequency: 1318.51,
      huePosition: 350,
      rgb: [247, 191, 180]
    },
    {
      name: "Charcoal Ash",
      hex: "#3D3D3D",
      closestNote: "G6",
      frequency: 1567.98,
      huePosition: 0,
      rgb: [61, 61, 61]
    },
    {
      name: "Silver Veil",
      hex: "#BFC0C0",
      closestNote: "B6",
      frequency: 1975.53,
      huePosition: 0,
      rgb: [191, 192, 192]
    },
    {
      name: "Arctic Sky",
      hex: "#CAF0F8",
      closestNote: "D7",
      frequency: 2349.32,
      huePosition: 190,
      rgb: [202, 240, 248]
    }
  ]
};

// Extended Solar Palettes for artistic variations
export const EXTENDED_SOLAR_PALETTES = {
  coreSolar: {
    title: "Core Solar Flare",
    data: SOLAR_FLARE_PALETTE.data,
  },
  ukiyoE: {
    title: "Ukiyo-e Harmony",
    data: [
      { hex: '#2e2e38', name: 'Midnight Indigo', freq: 65.41, note: 'C2' },
      { hex: '#4a6078', name: 'Steel River', freq: 146.83, note: 'D3' },
      { hex: '#8a9bb5', name: 'Periwinkle Mist', freq: 349.23, note: 'F4' },
      { hex: '#d9c3a5', name: 'Rice Paper', freq: 440.00, note: 'A4' },
      { hex: '#e8c39e', name: 'Pale Peach Glow', freq: 493.88, note: 'B4' },
      { hex: '#c94b35', name: 'Cinnabar Flame', freq: 415.30, note: 'G#4' },
      { hex: '#a63f2e', name: 'Vermilion Depth', freq: 369.99, note: 'F#4' },
      { hex: '#5e8c61', name: 'Pine Shadow', freq: 329.63, note: 'E4' },
    ],
  },
  monetGarden: {
    title: "Monet Water Garden",
    data: [
      { hex: '#a8d5e2', name: 'Sky Reflection', freq: 880.00, note: 'A5' },
      { hex: '#7db2c7', name: 'Lily Pond Blue', freq: 392.00, note: 'G4' },
      { hex: '#c7d9b0', name: 'Soft Willow Green', freq: 659.25, note: 'E5' },
      { hex: '#e0c9a6', name: 'Sunlit Path', freq: 493.88, note: 'B4' },
      { hex: '#f4e4bc', name: 'Golden Hour', freq: 523.25, note: 'C5' },
      { hex: '#d9826b', name: 'Poppy Warmth', freq: 440.00, note: 'A4' },
      { hex: '#b5654d', name: 'Earth Shadow', freq: 369.99, note: 'F#4' },
      { hex: '#8b7355', name: 'Clay Brown', freq: 293.66, note: 'D4' },
    ],
  },
  cyberNeon: {
    title: "Cyber Neon Pulse",
    data: [
      { hex: '#0d001a', name: 'Void Black', freq: 32.70, note: 'C1' },
      { hex: '#ff00aa', name: 'Magenta Surge', freq: 880.00, note: 'A5' },
      { hex: '#00ffff', name: 'Cyan Blade', freq: 1046.50, note: 'C6' },
      { hex: '#ffea00', name: 'Acid Yellow', freq: 659.25, note: 'E5' },
    ],
  },
  auroraVeil: {
    title: "Aurora Veil",
    data: [
      { hex: '#0a1628', name: 'Deep Night', freq: 27.50, note: 'A0' },
      { hex: '#1e3a5f', name: 'Arctic Blue', freq: 49.00, note: 'G1' },
      { hex: '#4a6741', name: 'Northern Green', freq: 61.74, note: 'B1' },
      { hex: '#7b68ee', name: 'Electric Indigo', freq: 130.81, note: 'C3' },
    ],
  },
};

// Original palettes for backward compatibility
export const PALETTES = [
  {
    name: "Mocha Mousse",
    colors: ["#6F4E37", "#A0785A", "#D2B48C", "#EDE0D4", "#F5F0EA"],
    instrument: "piano",
  },
  {
    name: "Neon Night",
    colors: ["#FF2E63", "#00F0FF", "#39FF14", "#FF00AA", "#1A0033"],
    instrument: "sawtooth",
  },
  {
    name: "Ocean Drone",
    colors: ["#0A3D62", "#1E90FF", "#7EC8E3", "#A8DADC", "#E0F7FA"],
    instrument: "strings",
  },
  {
    name: "Game Boy",
    colors: ["#0F380F", "#306230", "#8BAC0F", "#9BBC0F"],
    instrument: "square",
  },
  {
    name: "Dreamy Pastels",
    colors: ["#FAD0C9", "#FFD3E0", "#C7CEEA", "#A8D5BA", "#FFE5D9"],
    instrument: "triangle",
  },
  {
    name: "Jazz Sunset",
    colors: ["#C85C3F", "#E89F71", "#F4C095", "#D9A679", "#8C5523"],
    instrument: "guitar",
  },
  {
    name: "Cyber Lime",
    colors: ["#00FF9F", "#39FF14", "#00D4FF", "#FF00E5", "#1E0033"],
    instrument: "sawtooth",
  },
  {
    name: "Earth & Moss",
    colors: ["#4A7043", "#8A9A5B", "#B2C9A1", "#DDEBD9", "#2F3D2A"],
    instrument: "bell",
  }
];

// Export all palettes
export const ALL_PALETTES = {
  rainbow: RAINBOW_PALETTE,
  solarFlare: SOLAR_FLARE_PALETTE,
  legacy: PALETTES
};

// Utility functions for color-frequency mapping
export const getFrequencyFromHex = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r + g + b) / 3;
  return 200 + (brightness / 255) * 600;
};

// Enhanced frequency calculation for color wheel
export const getFrequencyFromHsl = (h, s, l) => {
  // Map hue to frequency (0-360 degrees -> 200-2000Hz)
  const baseFreq = 200 + (h / 360) * 1800;
  
  // Adjust for saturation and lightness
  const saturationFactor = 0.5 + (s / 100) * 0.5;
  const lightnessFactor = 0.3 + (l / 100) * 0.7;
  
  return baseFreq * saturationFactor * lightnessFactor;
};

// Convert HSL to RGB for color wheel
export const hslToRgb = (h, s, l) => {
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

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

// Convert HSL to Hex
export const hslToHex = (h, s, l) => {
  const { r, g, b } = hslToRgb(h, s, l);
  
  const toHex = (x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Get musical note from frequency with enhanced accuracy
export const getNoteFromFrequency = (frequency) => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const a4 = 440;
  const semitones = 12 * Math.log2(frequency / a4);
  const noteIndex = Math.round(semitones) % 12;
  const octave = Math.floor((semitones + 57) / 12);
  return `${noteNames[noteIndex < 0 ? noteIndex + 12 : noteIndex]}${octave}`;
};

// Get octave information from frequency
export const getOctaveFromFrequency = (frequency) => {
  const a4 = 440;
  const semitones = 12 * Math.log2(frequency / a4);
  return Math.floor((semitones + 57) / 12);
};

// Get frequency range for an octave
export const getOctaveFrequencyRange = (octave) => {
  const a4 = 440;
  const c0 = a4 * Math.pow(2, -4.75); // C0 frequency
  const octaveStartFreq = c0 * Math.pow(2, octave);
  const octaveEndFreq = c0 * Math.pow(2, octave + 1);
  
  return {
    start: octaveStartFreq,
    end: octaveEndFreq,
    startNote: 'C' + octave,
    endNote: 'B' + octave
  };
};

export const getClosestNote = (frequency) => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const a4 = 440;
  const semitones = 12 * Math.log2(frequency / a4);
  const noteIndex = Math.round(semitones) % 12;
  const octave = Math.floor((semitones + 57) / 12);
  return noteNames[noteIndex < 0 ? noteIndex + 12 : noteIndex] + octave;
};

export const hexToHue = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  if (delta === 0) return 0;
  
  let hue;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }
  
  return Math.round(hue * 60);
};
