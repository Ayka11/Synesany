export interface PianoKey {
  note: string;
  freq: number;
  color: string;
}

export const PIANO_KEYS: PianoKey[] = [
  // Octave 0 (A0–G#0)
  { name: "A0", freq: 27.50, color: "rgb(197, 34, 0)", hex: "#C52200", note: "A0" },
  { name: "A#0", freq: 29.14, color: "rgb(255, 69, 0)", hex: "#FF4500", note: "A#" },
  { name: "B0", freq: 30.87, color: "rgb(204, 204, 0)", hex: "#CCCC00", note: "B0" },
  { name: "C1", freq: 32.70, color: "rgb(102, 152, 0)", hex: "#669800", note: "C1" },
  { name: "C#1", freq: 34.65, color: "rgb(0, 100, 0)", hex: "#006400", note: "C#" },
  { name: "D1", freq: 36.71, color: "rgb(0, 50, 70)", hex: "#003246", note: "D1" },
  { name: "D#1", freq: 38.89, color: "rgb(0, 0, 139)", hex: "#00008B", note: "D#" },
  { name: "E1", freq: 41.20, color: "rgb(75, 0, 130)", hex: "#4B0082", note: "E1" },
  { name: "F1", freq: 43.65, color: "rgb(112, 0, 171)", hex: "#7000AB", note: "F1" },
  { name: "F#1", freq: 46.25, color: "rgb(148, 0, 211)", hex: "#9400D3", note: "F#" },
  { name: "G1", freq: 49.00, color: "rgb(157, 0, 106)", hex: "#9D006A", note: "G1" },
  { name: "G#1", freq: 51.91, color: "rgb(165, 0, 0)", hex: "#A50000", note: "G#" },
// Octave 1 (A1–G#1)
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

  // Octave 2 (A2–G#2)
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

  // Octave 3 (A3–G#3)
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

  // Octave 4 (A4–G#4)
  { name: "A4", freq: 440.00, color: "rgb(249, 85, 0)", hex: "#F95500", note: "A4" },
  { name: "A#4", freq: 466.16, color: "rgb(255, 169, 0)", hex: "#FFA900", note: "A#" },
  { name: "B4", freq: 493.88, color: "rgb(255, 255, 51)", hex: "#FFFF33", note: "B4" },
  { name: "C5", freq: 523.25, color: "rgb(128, 240, 26)", hex: "#80F01A", note: "C5" },
  { name: "C#5", freq: 554.37, color: "rgb(0, 224, 0)", hex: "#00E000", note: "C#" },
  { name: "D5", freq: 587.33, color: "rgb(26, 138, 128)", hex: "#1A8A80", note: "D5" },
  { name: "D#5", freq: 622.25, color: "rgb(51, 51, 255)", hex: "#3333FF", note: "D#" },
  { name: "E5", freq: 659.25, color: "rgb(143, 51, 229)", hex: "#8F33E5", note: "E5" },
  { name: "F5", freq: 698.46, color: "rgb(178, 77, 242)", hex: "#B24DF2", note: "F5" },
  { name: "F#5", freq: 739.99, color: "rgb(213, 102, 255)", hex: "#D566FF", note: "F#" },
  { name: "G5", freq: 783.99, color: "rgb(234, 77, 153)", hex: "#EA4D99", note: "G5" },
  { name: "G#5", freq: 830.61, color: "rgb(255, 51, 51)", hex: "#FF3333", note: "G#" },

  // Octave 5 (A5–G#5)
  { name: "A5", freq: 880.00, color: "rgb(255, 123, 77)", hex: "#FF7B4D", note: "A5" },
  { name: "A#5", freq: 932.33, color: "rgb(255, 194, 102)", hex: "#FFC266", note: "A#" },
  { name: "B5", freq: 987.77, color: "rgb(255, 255, 102)", hex: "#FFFF66", note: "B5" },
  { name: "C6", freq: 1046.50, color: "rgb(179, 255, 102)", hex: "#B3FF66", note: "C6" },
  { name: "C#6", freq: 1108.73, color: "rgb(102, 255, 102)", hex: "#66FF66", note: "C#" },
  { name: "D6", freq: 1174.66, color: "rgb(102, 179, 179)", hex: "#66B3B3", note: "D6" },
  { name: "D#6", freq: 1244.51, color: "rgb(102, 102, 255)", hex: "#6666FF", note: "D#" },
  { name: "E6", freq: 1318.51, color: "rgb(170, 102, 242)", hex: "#AA66F2", note: "E6" },
  { name: "F6", freq: 1396.91, color: "rgb(202, 128, 249)", hex: "#CA80F9", note: "F6" },
  { name: "F#6", freq: 1479.98, color: "rgb(234, 153, 255)", hex: "#EA99FF", note: "F#" },
  { name: "G6", freq: 1567.98, color: "rgb(245, 128, 179)", hex: "#F580B3", note: "G6" },
  { name: "G#6", freq: 1661.22, color: "rgb(255, 102, 102)", hex: "#FF6666", note: "G#" },

  // Octave 6 (A6–G#6)
  { name: "A6", freq: 1760.00, color: "rgb(255, 161, 128)", hex: "#FFA180", note: "A6" },
  { name: "A#6", freq: 1864.66, color: "rgb(255, 219, 153)", hex: "#FFDB99", note: "A#" },
  { name: "B6", freq: 1975.53, color: "rgb(255, 255, 153)", hex: "#FFFF99", note: "B6" },
  { name: "C7", freq: 2093.00, color: "rgb(204, 255, 153)", hex: "#CCFF99", note: "C7" },
  { name: "C#7", freq: 2217.46, color: "rgb(153, 255, 153)", hex: "#99FF99", note: "C#" },
  { name: "D7", freq: 2349.32, color: "rgb(153, 204, 204)", hex: "#99CCCC", note: "D7" },
  { name: "D#7", freq: 2489.02, color: "rgb(153, 153, 255)", hex: "#9999FF", note: "D#" },
  { name: "E7", freq: 2637.02, color: "rgb(197, 153, 255)", hex: "#C599FF", note: "E7" },
  { name: "F7", freq: 2793.83, color: "rgb(222, 176, 255)", hex: "#DEB0FF", note: "F7" },
  { name: "F#7", freq: 2959.96, color: "rgb(246, 198, 255)", hex: "#F6C6FF", note: "F#" },
  { name: "G7", freq: 3135.96, color: "rgb(251, 176, 204)", hex: "#FBB0CC", note: "G7" },
  { name: "G#7", freq: 3322.44, color: "rgb(255, 153, 153)", hex: "#FF9999", note: "G#" },

  // Octave 7 (A7–C8) — final partial octave
  { name: "A7", freq: 3520.00, color: "rgb(255, 194, 176)", hex: "#FFC2B0", note: "A7" },
  { name: "A#7", freq: 3729.31, color: "rgb(255, 234, 198)", hex: "#FFEAC6", note: "A#" },
  { name: "B7", freq: 3951.07, color: "rgb(255, 255, 204)", hex: "#FFFFCC", note: "B7" },
  { name: "C8", freq: 4186.01, color: "rgb(255, 255, 230)", hex: "#FFFFE6", note: "C8" },
];

export const DEFAULT_COLORS = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00',
  '#ADFF2F', '#00FF00', '#00FA9A', '#00FFFF', '#00BFFF',
  '#0000FF', '#8A2BE2', '#FF00FF', '#FF1493', '#FF69B4',
  '#FFFFFF', '#C0C0C0', '#808080', '#404040', '#000000',
];

export type BrushType = 'round' | 'square' | 'spray' | 'star' | 'calligraphy' | 'pencil' | 'marker';

export type InstrumentType = 'violin' | 'bell' | 'guitar' | 'bass' | 'piano';

export type SonificationMode = 'simple' | 'timeline' | 'colorfield' | 'harmonic';

export interface DrawingStroke {
  points: { x: number; y: number }[];
  color: string;
  brush: BrushType;
  size: number;
  timestamp: number;
  duration?: number; // Duration in seconds (optional)
}

export interface SavedDrawing {
  id: string;
  name: string;
  thumbnail: string;
  strokes: DrawingStroke[];
  createdAt: number;
}
