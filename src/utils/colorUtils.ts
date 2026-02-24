// src/utils/colorUtils.ts
export const getFrequencyFromHsl = (h: number, s: number, l: number) => {
  const baseFreq = 200 + (h / 360) * 1800;
  const saturationFactor = 0.5 + (s / 100) * 0.5;
  const lightnessFactor = 0.3 + (l / 100) * 0.7;
  return baseFreq * saturationFactor * lightnessFactor;
};

export const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
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

export const hslToHex = (h: number, s: number, l: number) => {
  const { r, g, b } = hslToRgb(h, s, l);
  const toHex = (x: number) => Math.round(x).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Dummy note mapping for preview (replace with your real logic)
const NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];
export function getClosestNote(freq: number) {
  const A4 = 440;
  const n = Math.round(12 * Math.log2(freq / A4));
  const noteIndex = (n + 9) % 12;
  const octave = 4 + Math.floor((n + 9) / 12);
  return `${NOTES[noteIndex]}${octave}`;
}

export function getNoteFromFrequency(freq: number) {
  return getClosestNote(freq);
}
