import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useToolbarStore = create(
  persist(
    (set, get) => ({
      // Panel management
      panels: {
        color: { id: 'color', position: { x: 20, y: 80 }, size: { width: 340, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true },
        brush: { id: 'brush', position: { x: 380, y: 80 }, size: { width: 340, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true },
        sound: { id: 'sound', position: { x: 740, y: 80 }, size: { width: 340, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true },
        tools: { id: 'tools', position: { x: 1100, y: 80 }, size: { width: 300, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true },
      },

      updatePanelPosition: (id, pos) =>
        set((s) => ({
          panels: {
            ...s.panels,
            [id]: { ...s.panels[id], position: pos },
          },
        })),

      updatePanelSize: (id, size) =>
        set((s) => ({
          panels: {
            ...s.panels,
            [id]: { ...s.panels[id], size },
          },
        })),

      togglePanelCollapsed: (id) =>
        set((s) => ({
          panels: {
            ...s.panels,
            [id]: { ...s.panels[id], collapsed: !s.panels[id].collapsed },
          },
        })),

      setPanelVisible: (id, visible) =>
        set((s) => ({
          panels: {
            ...s.panels,
            [id]: { ...s.panels[id], visible },
          },
        })),

      bringPanelToFront: (id) =>
        set((s) => {
          const maxZ = Math.max(...Object.values(s.panels).map((p) => p.zIndex));
          return {
            panels: {
              ...s.panels,
              [id]: { ...s.panels[id], zIndex: maxZ + 10 },
            },
          };
        }),

      resetAllPanels: () =>
        set({
          panels: {
            color: { id: 'color', position: { x: 20, y: 80 }, size: { width: 340, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true },
            brush: { id: 'brush', position: { x: 380, y: 80 }, size: { width: 340, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true },
            sound: { id: 'sound', position: { x: 740, y: 80 }, size: { width: 340, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true },
            tools: { id: 'tools', position: { x: 1100, y: 80 }, size: { width: 300, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true },
          },
        }),

      // Creative state
      currentColor: '#ffffff',
      setCurrentColor: (hex) => set({ currentColor: hex }),
      favoriteColors: [],
      toggleFavoriteColor: (hex) =>
        set((s) => ({
          favoriteColors: s.favoriteColors.includes(hex)
            ? s.favoriteColors.filter((c) => c !== hex)
            : [...s.favoriteColors, hex],
        })),

      selectedBrush: 'round',
      setSelectedBrush: (brush) => set({ selectedBrush: brush }),
      favoriteBrushes: [],
      toggleFavoriteBrush: (brushId) =>
        set((s) => ({
          favoriteBrushes: s.favoriteBrushes.includes(brushId)
            ? s.favoriteBrushes.filter((id) => id !== brushId)
            : [...s.favoriteBrushes, brushId],
        })),
      brushSize: 16,
      setBrushSize: (size) => set({ brushSize: Math.max(1, Math.min(128, size)) }),

      soundEnabled: true,
      toggleSoundEnabled: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      masterVolume: 0.7,
      setMasterVolume: (vol) => set({ masterVolume: Math.max(0, Math.min(1, vol)) }),

      sonificationMode: 'timeline',
      setSonificationMode: (mode) => set({ sonificationMode: mode }),

      currentInstrument: 'piano',
      setCurrentInstrument: (inst) => set({ currentInstrument: inst }),

      adsr: { attack: 0.05, decay: 0.2, sustain: 0.6, release: 0.8 },
      setADSR: (updates) => set((s) => ({ adsr: { ...s.adsr, ...updates } })),

      // Legacy/sidebar state (keep for compatibility)
      sidebarOpen: true,
      previousColor: '#ff6b6b',
      favoritePalettes: [],
      activePalette: null,
      expandedSections: {
        color: true,
        palettes: true,
        brushes: true,
        actions: true,
      },
    }),
    {
      name: 'synesthetica-toolbar-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        panels: state.panels,
        currentColor: state.currentColor,
        favoriteColors: state.favoriteColors,
        selectedBrush: state.selectedBrush,
        favoriteBrushes: state.favoriteBrushes,
        brushSize: state.brushSize,
        soundEnabled: state.soundEnabled,
        masterVolume: state.masterVolume,
        sonificationMode: state.sonificationMode,
        currentInstrument: state.currentInstrument,
        adsr: state.adsr,
      }),
    }
  )
);
        size: { width: 280, height: 400 },
        state: 'docked',
        dockZone: 'left',
        zIndex: 10,
        isCollapsed: false
      },
      brushPanel: {
        id: 'brushPanel',
        position: { x: 20, y: 520 },
        size: { width: 280, height: 200 },
        state: 'docked',
        dockZone: 'left',
        zIndex: 11,
        isCollapsed: false
      },
      soundPanel: {
        id: 'soundPanel',
        position: { x: 20, y: 740 },
        size: { width: 280, height: 300 },
        state: 'docked',
        dockZone: 'left',
        zIndex: 12,
        isCollapsed: false
      },
      toolPanel: {
        id: 'toolPanel',
        position: { x: typeof window !== 'undefined' ? window.innerWidth - 300 : 1000, y: 100 },
        size: { width: 276, height: 400 },
        state: 'docked',
        dockZone: 'right',
        zIndex: 13,
        isCollapsed: false
      }
    },
    layout: {
      preset: 'default',
      snapToGrid: true,
      gridSize: 8,
      showGrid: false,
      showDockZones: false
    }
  }),
}));

// Brush definitions
export const BRUSHES = {
  round: {
    id: 'round',
    name: 'Round',
    icon: '●',
    description: 'Soft circular brush',
    timbre: 'smooth',
  },
  square: {
    id: 'square',
    name: 'Square',
    icon: '■',
    description: 'Hard edged square',
    timbre: 'sharp',
  },
  sawtooth: {
    id: 'sawtooth',
    name: 'Sawtooth',
    icon: '⚡',
    description: 'Jagged textured stroke',
    timbre: 'bright',
  },
  triangle: {
    id: 'triangle',
    name: 'Triangle',
    icon: '▲',
    description: 'Angular triangular brush',
    timbre: 'hollow',
  },
  star: {
    id: 'star',
    name: 'Star',
    icon: '★',
    description: 'Five-pointed star shape',
    timbre: 'sparkling',
  },
  cross: {
    id: 'cross',
    name: 'Cross',
    icon: '✚',
    description: 'Cross-shaped brush',
    timbre: 'percussive',
  },
  spray: {
    id: 'spray',
    name: 'Spray',
    icon: '◈',
    description: 'Spray paint effect',
    timbre: 'airy',
  },
};

// Color palettes
export const COLOR_PALETTES = {
  'Mocha Mousse': {
    colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460', '#D2691E'],
    description: 'Warm coffee tones',
  },
  'Neon Night Drive': {
    colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF', '#06FFB4'],
    description: 'Vibrant neon colors',
  },
  'Ocean Drone': {
    colors: ['#03045E', '#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#ADE8F4'],
    description: 'Deep ocean blues',
  },
  'Forest Canopy': {
    colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2', '#B7E4C7'],
    description: 'Lush forest greens',
  },
  'Sunset Glow': {
    colors: ['#FF6B35', '#F77F00', '#FCBF49', '#EAE2B7', '#D62828', '#F77F00'],
    description: 'Warm sunset oranges',
  },
  'Galaxy Purple': {
    colors: ['#7209B7', '#560BAD', '#480CA8', '#3A0CA3', '#3F37C9', '#4361EE'],
    description: 'Deep space purples',
  },
  'Monochrome': {
    colors: ['#212529', '#495057', '#6C757D', '#ADB5BD', '#CED4DA', '#F8F9FA'],
    description: 'Classic grayscale',
  },
  'Pastel Dreams': {
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4'],
    description: 'Soft pastel shades',
  },
};

export const NOTE_PALETTES = Array.from({ length: 10 }, (_, octave) => {
  const noteOrder = [
    { note: 'A', semitoneFromA4: 0 },
    { note: 'A#', alt: 'Bb', semitoneFromA4: 1 },
    { note: 'B', semitoneFromA4: 2 },
    { note: 'C', semitoneFromA4: -9 },
    { note: 'C#', alt: 'Db', semitoneFromA4: -8 },
    { note: 'D', semitoneFromA4: -7 },
    { note: 'D#', alt: 'Eb', semitoneFromA4: -6 },
    { note: 'E', semitoneFromA4: -5 },
    { note: 'F', semitoneFromA4: -4 },
    { note: 'F#', alt: 'Gb', semitoneFromA4: -3 },
    { note: 'G', semitoneFromA4: -2 },
    { note: 'G#', alt: 'Ab', semitoneFromA4: -1 },
  ];

  const notes = noteOrder.map(({ note, alt, semitoneFromA4 }) => {
    const semitoneOffset = semitoneFromA4 + 12 * (octave - 4);
    const frequency = 440 * Math.pow(2, semitoneOffset / 12);
    return {
      note: `${note}${octave}`,
      alt: alt ? `${alt}${octave}` : null,
      frequency,
    };
  });

  return {
    name: `Octave ${octave}`,
    octave,
    notes,
  };
});

// Utility functions
export const getFrequencyFromColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r + g + b) / 3;
  return 200 + (brightness / 255) * 600;
};

export const getNoteFromFrequency = (freq) => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const a4 = 440;
  const semitones = 12 * Math.log2(freq / a4);
  const noteIndex = Math.round(semitones) % 12;
  const octave = Math.floor((semitones + 57) / 12);
  return noteNames[noteIndex < 0 ? noteIndex + 12 : noteIndex] + octave;
};
