import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Debounce utility
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

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

      updatePanelPosition: debounce((id, pos) => {
        set((s) => {
          const currentPos = s.panels[id].position;
          // Only skip update if position is essentially the same (within small epsilon)
          if (Math.abs(currentPos.x - pos.x) < 1 && Math.abs(currentPos.y - pos.y) < 1) {
            return s; // No update needed
          }
          return {
            panels: {
              ...s.panels,
              [id]: { ...s.panels[id], position: pos },
            },
          };
        });
      }, 16), // 16ms debounce

      updatePanelSize: debounce((id, size) => {
        set((s) => {
          const currentSize = s.panels[id].size;
          // Only skip update if size is essentially the same (within small epsilon)
          if (Math.abs(currentSize.width - size.width) < 1 && Math.abs(currentSize.height - size.height) < 1) {
            return s; // No update needed
          }
          return {
            panels: {
              ...s.panels,
              [id]: { ...s.panels[id], size },
            },
          };
        });
      }, 16), // 16ms debounce

      togglePanelCollapsed: debounce((id) =>
        set((s) => ({
          panels: {
            ...s.panels,
            [id]: { ...s.panels[id], collapsed: !s.panels[id].collapsed },
          },
        });
      }, 16), // 16ms debounce

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
      name: 'toolbar-store',
      partialize: (state) => ({
        panels: state.panels,
        currentColor: state.currentColor,
        selectedBrush: state.selectedBrush,
        brushSize: state.brushSize,
        soundEnabled: state.soundEnabled,
        masterVolume: state.masterVolume,
        sonificationMode: state.sonificationMode,
        currentInstrument: state.currentInstrument,
        adsr: state.adsr,
        favoriteColors: state.favoriteColors,
        favoriteBrushes: state.favoriteBrushes,
      }),
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
