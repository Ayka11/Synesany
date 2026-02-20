import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getFrequencyFromHex, getNoteFromFrequency as getNoteFromFrequencyFromPalettes } from '../constants/palettes.js';

export const getFrequencyFromColor = (hex) => getFrequencyFromHex(hex);
export const getNoteFromFrequency = (frequency) => getNoteFromFrequencyFromPalettes(frequency);

// Debounce utility
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const getDefaultPanelsForViewport = (viewport) => {
  const width = viewport?.width ?? (typeof window !== 'undefined' ? window.innerWidth : 1920);
  const height = viewport?.height ?? (typeof window !== 'undefined' ? window.innerHeight : 1080);

  const padding = 16;
  const top = padding;
  const left = padding;
  const headerOffset = 64;

  const panelWidth = width < 1280 ? 300 : 340;
  const toolsWidth = width < 1280 ? 280 : 300;

  const rightX = Math.max(left, width - panelWidth - padding);
  const bottomY = Math.max(top + headerOffset + 220, height - 420);
  const upperY = top + headerOffset;

  return {
    color: { id: 'color', position: { x: left, y: upperY }, size: { width: panelWidth, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true, docked: true },
    brush: { id: 'brush', position: { x: rightX, y: upperY }, size: { width: panelWidth, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true, docked: true },
    sound: { id: 'sound', position: { x: rightX, y: bottomY }, size: { width: panelWidth, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true, docked: true },
    tools: { id: 'tools', position: { x: left, y: bottomY }, size: { width: toolsWidth, height: 'auto' }, collapsed: false, zIndex: 1000, visible: true, docked: true },
  };
};

export const useToolbarStore = create(
  persist(
    (set, get) => ({
      // Layout management
      layoutMode: 'floating', // 'stacked' | 'floating'
      
      // Panel management with smart default positions
      panels: getDefaultPanelsForViewport(),

      getDefaultPanelsForViewport,

      setLayoutMode: (mode) => set({ layoutMode: mode }),
      
      updatePanelPosition: debounce((id, pos) => {
        return set((s) => {
          const currentPos = s.panels[id].position;
          if (Math.abs(currentPos.x - pos.x) < 1 && Math.abs(currentPos.y - pos.y) < 1) {
            return s;
          }
          return {
            panels: {
              ...s.panels,
              [id]: { ...s.panels[id], position: pos },
            },
          };
        });
      }, 16),

      updatePanelSize: debounce((id, size) => {
        return set((s) => {
          const currentSize = s.panels[id].size;
          if (Math.abs(currentSize.width - size.width) < 1 && Math.abs(currentSize.height - size.height) < 1) {
            return s;
          }
          return {
            panels: {
              ...s.panels,
              [id]: { ...s.panels[id], size },
            },
          };
        });
      }, 16),

      togglePanelCollapsed: debounce((id) => {
        return set((s) => ({
          panels: {
            ...s.panels,
            [id]: { ...s.panels[id], collapsed: !s.panels[id].collapsed },
          },
        }));
      }, 16),

      setPanelVisible: (id, visible) =>
        set((s) => ({
          panels: {
            ...s.panels,
            [id]: { ...s.panels[id], visible },
          },
        })),

      bringPanelToFront: (id) =>
        set((s) => ({
          panels: {
            ...s.panels,
            [id]: { ...s.panels[id], zIndex: Math.max(...Object.values(s.panels).map(p => p.zIndex || 0)) + 1 },
          },
        })),

      // Creative state
      currentColor: '#FF6B6B',
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
      toggleSoundEnabled: () => set({ soundEnabled: !get().soundEnabled }),

      masterVolume: 0.5,
      setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),

      // Visual zoom for painting accuracy (1x-3x range)
      visualZoom: 1,
      setVisualZoom: (zoom) => set({ visualZoom: Math.max(1, Math.min(3, zoom)) }),

      // Sonification duration settings (in seconds)
      sonificationDurations: {
        simple: 60,        // 1 minute default (30s-2min range)
        timeline: 180,    // 3 minutes default (1-5min range)
        colorfield: 300,  // 5 minutes default (2-8min range)
        harmonic: 240     // 4 minutes default (1.5-6min range)
      },
      setSonificationDuration: (mode, duration) => set((s) => ({
        sonificationDurations: {
          ...s.sonificationDurations,
          [mode]: duration
        }
      })),

      sonificationMode: 'simple',
      setSonificationMode: (mode) => set({ sonificationMode: mode }),

      currentInstrument: 'piano',
      setCurrentInstrument: (instrument) => set({ currentInstrument: instrument }),

      adsr: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.7,
        release: 0.3,
      },
      setADSR: (adsr) =>
        set((s) => ({
          adsr: {
            ...s.adsr,
            ...adsr,
          },
        })),

      // UI state
      favoritePalettes: [],
      activePalette: null,
      expandedSections: {
        color: true,
        palettes: true,
        brushes: true,
        actions: true,
      },
      setExpandedSections: (sections) => set({ expandedSections: sections }),

      // Actions
      autoArrangePanels: (viewport) => {
        const defaults = get().getDefaultPanelsForViewport(viewport);
        set({ panels: defaults });
      },

      resetAllPanels: () =>
        set({ panels: get().getDefaultPanelsForViewport() }),
    }),
    {
      name: 'toolbar-store',
      partialize: (state) => ({
        layoutMode: state.layoutMode,
        panels: state.panels,
        currentColor: state.currentColor,
        selectedBrush: state.selectedBrush,
        brushSize: state.brushSize,
        soundEnabled: state.soundEnabled,
        masterVolume: state.masterVolume,
        visualZoom: state.visualZoom,
        sonificationDurations: state.sonificationDurations,
        sonificationMode: state.sonificationMode,
        currentInstrument: state.currentInstrument,
        adsr: state.adsr,
        favoriteColors: state.favoriteColors,
        favoriteBrushes: state.favoriteBrushes,
      }),
      version: 1,
      storage:
        createJSONStorage(() =>
          (typeof window !== 'undefined' ? localStorage : noopStorage)
        ),
    }
  )
);
