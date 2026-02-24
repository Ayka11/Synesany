export interface PianoKey {
  note: string;
  freq: number;
  color: string;
}

export const PIANO_KEYS: PianoKey[] = [
  { note: 'A0', freq: 27.50, color: '#8B0000' },
  { note: 'A#0', freq: 29.14, color: '#8B1500' },
  { note: 'B0', freq: 30.87, color: '#8B2A00' },
  { note: 'C1', freq: 32.70, color: '#8B3F00' },
  { note: 'C#1', freq: 34.65, color: '#8B5400' },
  { note: 'D1', freq: 36.71, color: '#8B6900' },
  { note: 'D#1', freq: 38.89, color: '#8B7E00' },
  { note: 'E1', freq: 41.20, color: '#7E8B00' },
  { note: 'F1', freq: 43.65, color: '#698B00' },
  { note: 'F#1', freq: 46.25, color: '#548B00' },
  { note: 'G1', freq: 49.00, color: '#3F8B00' },
  { note: 'G#1', freq: 51.91, color: '#2A8B00' },
  { note: 'A1', freq: 55.00, color: '#158B00' },
  { note: 'A#1', freq: 58.27, color: '#008B00' },
  { note: 'B1', freq: 61.74, color: '#008B15' },
  { note: 'C2', freq: 65.41, color: '#008B2A' },
  { note: 'C#2', freq: 69.30, color: '#008B3F' },
  { note: 'D2', freq: 73.42, color: '#008B54' },
  { note: 'D#2', freq: 77.78, color: '#008B69' },
  { note: 'E2', freq: 82.41, color: '#008B7E' },
  { note: 'F2', freq: 87.31, color: '#008B8B' },
  { note: 'F#2', freq: 92.50, color: '#007E8B' },
  { note: 'G2', freq: 98.00, color: '#00698B' },
  { note: 'G#2', freq: 103.83, color: '#00548B' },
  { note: 'A2', freq: 110.00, color: '#003F8B' },
  { note: 'A#2', freq: 116.54, color: '#002A8B' },
  { note: 'B2', freq: 123.47, color: '#00158B' },
  { note: 'C3', freq: 130.81, color: '#00008B' },
  { note: 'C#3', freq: 138.59, color: '#15008B' },
  { note: 'D3', freq: 146.83, color: '#2A008B' },
  { note: 'D#3', freq: 155.56, color: '#3F008B' },
  { note: 'E3', freq: 164.81, color: '#54008B' },
  { note: 'F3', freq: 174.61, color: '#69008B' },
  { note: 'F#3', freq: 185.00, color: '#7E008B' },
  { note: 'G3', freq: 196.00, color: '#8B007E' },
  { note: 'G#3', freq: 207.65, color: '#8B0069' },
  { note: 'A3', freq: 220.00, color: '#8B0054' },
  { note: 'A#3', freq: 233.08, color: '#8B003F' },
  { note: 'B3', freq: 246.94, color: '#8B002A' },
  { note: 'C4', freq: 261.63, color: '#FF0000' },
  { note: 'C#4', freq: 277.18, color: '#FF1E00' },
  { note: 'D4', freq: 293.66, color: '#FF3C00' },
  { note: 'D#4', freq: 311.13, color: '#FF5A00' },
  { note: 'E4', freq: 329.63, color: '#FF7800' },
  { note: 'F4', freq: 349.23, color: '#FF9600' },
  { note: 'F#4', freq: 369.99, color: '#FFB400' },
  { note: 'G4', freq: 392.00, color: '#FFD200' },
  { note: 'G#4', freq: 415.30, color: '#FFF000' },
  { note: 'A4', freq: 440.00, color: '#E1FF00' },
  { note: 'A#4', freq: 466.16, color: '#C3FF00' },
  { note: 'B4', freq: 493.88, color: '#A5FF00' },
  { note: 'C5', freq: 523.25, color: '#87FF00' },
  { note: 'C#5', freq: 554.37, color: '#69FF00' },
  { note: 'D5', freq: 587.33, color: '#4BFF00' },
  { note: 'D#5', freq: 622.25, color: '#2DFF00' },
  { note: 'E5', freq: 659.26, color: '#0FFF00' },
  { note: 'F5', freq: 698.46, color: '#00FF0F' },
  { note: 'F#5', freq: 739.99, color: '#00FF2D' },
  { note: 'G5', freq: 783.99, color: '#00FF4B' },
  { note: 'G#5', freq: 830.61, color: '#00FF69' },
  { note: 'A5', freq: 880.00, color: '#00FF87' },
  { note: 'A#5', freq: 932.33, color: '#00FFA5' },
  { note: 'B5', freq: 987.77, color: '#00FFC3' },
  { note: 'C6', freq: 1046.50, color: '#00FFE1' },
  { note: 'C#6', freq: 1108.73, color: '#00FFFF' },
  { note: 'D6', freq: 1174.66, color: '#00E1FF' },
  { note: 'D#6', freq: 1244.51, color: '#00C3FF' },
  { note: 'E6', freq: 1318.51, color: '#00A5FF' },
  { note: 'F6', freq: 1396.91, color: '#0087FF' },
  { note: 'F#6', freq: 1479.98, color: '#0069FF' },
  { note: 'G6', freq: 1567.98, color: '#004BFF' },
  { note: 'G#6', freq: 1661.22, color: '#002DFF' },
  { note: 'A6', freq: 1760.00, color: '#000FFF' },
  { note: 'A#6', freq: 1864.66, color: '#0F00FF' },
  { note: 'B6', freq: 1975.53, color: '#2D00FF' },
  { note: 'C7', freq: 2093.00, color: '#4B00FF' },
  { note: 'C#7', freq: 2217.46, color: '#6900FF' },
  { note: 'D7', freq: 2349.32, color: '#8700FF' },
  { note: 'D#7', freq: 2489.02, color: '#A500FF' },
  { note: 'E7', freq: 2637.02, color: '#C300FF' },
  { note: 'F7', freq: 2793.83, color: '#E100FF' },
  { note: 'F#7', freq: 2959.96, color: '#FF00FF' },
  { note: 'G7', freq: 3135.96, color: '#FF00E1' },
  { note: 'G#7', freq: 3322.44, color: '#FF00C3' },
  { note: 'A7', freq: 3520.00, color: '#FF00A5' },
  { note: 'A#7', freq: 3729.31, color: '#FF0087' },
  { note: 'B7', freq: 3951.07, color: '#FF0069' },
  { note: 'C8', freq: 4186.01, color: '#FF004B' },
];

export const DEFAULT_COLORS = [
  '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00',
  '#ADFF2F', '#00FF00', '#00FA9A', '#00FFFF', '#00BFFF',
  '#0000FF', '#8A2BE2', '#FF00FF', '#FF1493', '#FF69B4',
  '#FFFFFF', '#C0C0C0', '#808080', '#404040', '#000000',
];

export type BrushType = 'round' | 'square' | 'spray' | 'star' | 'calligraphy' | 'pencil' | 'marker';

export type InstrumentType = 'sine' | 'triangle' | 'sawtooth' | 'square' | 'piano';

export type SonificationMode = 'simple' | 'timeline' | 'colorfield' | 'harmonic';

export interface DrawingStroke {
  points: { x: number; y: number }[];
  color: string;
  brush: BrushType;
  size: number;
  timestamp: number;
}

export interface SavedDrawing {
  id: string;
  name: string;
  thumbnail: string;
  strokes: DrawingStroke[];
  createdAt: number;
}
