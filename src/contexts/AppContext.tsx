import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { BrushType, InstrumentType, SonificationMode, DrawingStroke, SavedDrawing } from '@/data/pianoKeys';
import { audioEngine } from '@/lib/audioEngine';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface UserProfile {
  user_id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
}

interface AppContextType {
  // Auth
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  authLoading: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  mobilePanel: string | null;
  setMobilePanel: (p: string | null) => void;

  // Drawing
  currentColor: string;
  setCurrentColor: (c: string) => void;
  brushType: BrushType;
  setBrushType: (b: BrushType) => void;
  brushSize: number;
  setBrushSize: (s: number) => void;
  strokes: DrawingStroke[];
  addStroke: (s: DrawingStroke) => void;
  undoStack: DrawingStroke[][];
  redoStack: DrawingStroke[][];
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  zoom: number;
  setZoom: (z: number) => void;

  // Audio
  volume: number;
  setVolume: (v: number) => void;
  muted: boolean;
  setMuted: (m: boolean) => void;
  instrument: InstrumentType;
  setInstrument: (i: InstrumentType) => void;
  sonificationMode: SonificationMode;
  setSonificationMode: (m: SonificationMode) => void;

  // Soundscape
  isGenerating: boolean;
  generateProgress: number;
  generateSoundscape: () => void;

  // Gallery
  savedDrawings: SavedDrawing[];
  galleryLoading: boolean;
  saveCurrentDrawing: (name: string, thumbnail: string) => void;
  deleteDrawing: (id: string) => void;
  loadUserDrawings: () => void;

  // Daily limit
  dailyCount: number;
  dailyLimit: number;

  // Canvas ref
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<{ id: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('synesthetica-user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('synesthetica-profile');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<string | null>(null);

  // Drawing State
  const [currentColor, setCurrentColor] = useState('#FF0000');
  const [brushType, setBrushType] = useState<BrushType>('round');
  const [brushSize, setBrushSize] = useState(8);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [canvasDuration, setCanvasDuration] = useState(0);

  // Calculate total canvas duration based on strokes
  const calculateCanvasDuration = useCallback(() => {
    if (!strokes.length) return 0;
    // Use explicit duration if present, else estimate by stroke length
    return strokes.reduce((sum, s) => {
      if (typeof s.duration === 'number') return sum + s.duration;
      // Estimate: min 0.5s, scale by number of points
      return sum + Math.max(0.5, s.points.length / 200);
    }, 0);
  }, [strokes]);

  useEffect(() => {
    setCanvasDuration(calculateCanvasDuration());
  }, [strokes, calculateCanvasDuration]);
  const [undoStack, setUndoStack] = useState<DrawingStroke[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingStroke[][]>([]);
  const [zoom, setZoom] = useState(1);

  // Audio State
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMutedState] = useState(false);
  const [instrument, setInstrumentState] = useState<InstrumentType>('piano');
  const [sonificationMode, setSonificationModeState] = useState<SonificationMode>('simple');

  // Soundscape
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);

  // Gallery
  const [savedDrawings, setSavedDrawings] = useState<SavedDrawing[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // Daily limit
  const [dailyCount, setDailyCount] = useState(() => {
    try {
      const data = localStorage.getItem('synesthetica-daily');
      if (data) {
        const parsed = JSON.parse(data);
        const today = new Date().toDateString();
        if (parsed.date === today) return parsed.count;
      }
      return 0;
    } catch { return 0; }
  });
  const dailyLimit = 5;

  const canvasRef = useRef<HTMLCanvasElement>(null!);

  // Persist auth to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('synesthetica-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('synesthetica-user');
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('synesthetica-profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('synesthetica-profile');
    }
  }, [profile]);

  // Sync audio engine
  useEffect(() => { audioEngine.setVolume(volume); }, [volume]);
  useEffect(() => { audioEngine.setMuted(muted); }, [muted]);
  useEffect(() => { audioEngine.setInstrument(instrument); }, [instrument]);
  useEffect(() => { audioEngine.setMode(sonificationMode); }, [sonificationMode]);

  // Save daily count
  useEffect(() => {
    try {
      localStorage.setItem('synesthetica-daily', JSON.stringify({
        date: new Date().toDateString(), count: dailyCount,
      }));
    } catch {}
  }, [dailyCount]);

  // Load drawings when user changes
  useEffect(() => {
    if (user) {
      loadUserDrawings();
    } else {
      // Load from localStorage for non-authenticated users
      try {
        const saved = localStorage.getItem('synesthetica-gallery');
        setSavedDrawings(saved ? JSON.parse(saved) : []);
      } catch { setSavedDrawings([]); }
    }
  }, [user?.id]);

  // Auth functions
  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'signin', email, password }
      });
      if (error || data?.error) {
        return data?.error || error?.message || 'Sign in failed';
      }
      setUser({ id: data.user.id, email: data.user.email });
      setProfile(data.profile);
      setAuthModalOpen(false);
      return null;
    } catch (e: any) {
      return e.message || 'Sign in failed';
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<string | null> => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'signup', email, password }
      });
      if (error || data?.error) {
        return data?.error || error?.message || 'Sign up failed';
      }
      setUser({ id: data.user.id, email: data.user.email || email });
      setProfile(data.profile || { user_id: data.user.id, email, display_name: email.split('@')[0] });
      setAuthModalOpen(false);
      return null;
    } catch (e: any) {
      return e.message || 'Sign up failed';
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setProfile(null);
    setSavedDrawings([]);
    localStorage.removeItem('synesthetica-user');
    localStorage.removeItem('synesthetica-profile');
  }, []);

  // Gallery functions
  const loadUserDrawings = useCallback(async () => {
    if (!user) return;
    setGalleryLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('auth', {
        body: { action: 'get_drawings', user_id: user.id }
      });
      if (!error && data?.drawings) {
        const mapped: SavedDrawing[] = data.drawings.map((d: any) => ({
          id: d.id,
          name: d.name,
          thumbnail: d.thumbnail || '',
          strokes: d.stroke_data || [],
          createdAt: new Date(d.created_at).getTime(),
        }));
        setSavedDrawings(mapped);
      }
    } catch (e) {
      console.error('Failed to load drawings:', e);
    } finally {
      setGalleryLoading(false);
    }
  }, [user]);

  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    audioEngine.setVolume(v);
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    audioEngine.setMuted(m);
  }, []);

  const setInstrument = useCallback((i: InstrumentType) => {
    setInstrumentState(i);
    audioEngine.setInstrument(i);
  }, []);

  const setSonificationMode = useCallback((m: SonificationMode) => {
    setSonificationModeState(m);
    audioEngine.setMode(m);
  }, []);

  const addStroke = useCallback((stroke: DrawingStroke) => {
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
    setStrokes(prev => [...prev, stroke]);
  }, [strokes]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, strokes]);
    setStrokes(prev);
    setUndoStack(u => u.slice(0, -1));
  }, [undoStack, strokes]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, strokes]);
    setStrokes(next);
    setRedoStack(r => r.slice(0, -1));
  }, [redoStack, strokes]);

  const clearCanvas = useCallback(() => {
    if (strokes.length > 0) {
      setUndoStack(prev => [...prev, strokes]);
      setRedoStack([]);
    }
    setStrokes([]);
  }, [strokes]);

  const generateSoundscape = useCallback(async () => {
    if (strokes.length === 0 || isGenerating) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    setGenerateProgress(0);

    try {
      await audioEngine.generateSoundscape(
        strokes, canvas.width, canvas.height,
        (p) => setGenerateProgress(p)
      );
      setDailyCount(c => c + 1);
    } catch (e) {
      console.error('Soundscape generation failed:', e);
    } finally {
      setIsGenerating(false);
      setGenerateProgress(0);
    }
  }, [strokes, isGenerating]);

  const saveCurrentDrawing = useCallback(async (name: string, thumbnail: string) => {
    if (user) {
      // Save to database
      try {
        const { data, error } = await supabase.functions.invoke('auth', {
          body: {
            action: 'save_drawing',
            user_id: user.id,
            name,
            thumbnail,
            stroke_data: strokes,
          }
        });
        if (!error && data?.drawing) {
          const newDrawing: SavedDrawing = {
            id: data.drawing.id,
            name: data.drawing.name,
            thumbnail: data.drawing.thumbnail || '',
            strokes: data.drawing.stroke_data || [],
            createdAt: new Date(data.drawing.created_at).getTime(),
          };
          setSavedDrawings(prev => [newDrawing, ...prev]);
        }
      } catch (e) {
        console.error('Failed to save drawing:', e);
      }
    } else {
      // Save to localStorage
      const drawing: SavedDrawing = {
        id: uuidv4(),
        name,
        thumbnail,
        strokes: [...strokes],
        createdAt: Date.now(),
      };
      setSavedDrawings(prev => {
        const updated = [drawing, ...prev];
        try { localStorage.setItem('synesthetica-gallery', JSON.stringify(updated)); } catch {}
        return updated;
      });
    }
  }, [strokes, user]);

  const deleteDrawing = useCallback(async (id: string) => {
    if (user) {
      try {
        await supabase.functions.invoke('auth', {
          body: { action: 'delete_drawing', user_id: user.id, drawing_id: id }
        });
      } catch (e) {
        console.error('Failed to delete drawing:', e);
      }
    }
    setSavedDrawings(prev => {
      const updated = prev.filter(d => d.id !== id);
      if (!user) {
        try { localStorage.setItem('synesthetica-gallery', JSON.stringify(updated)); } catch {}
      }
      return updated;
    });
  }, [user]);

  return (
    // ...existing code...
    <AppContext.Provider value={{
      user, profile, authLoading, authModalOpen, setAuthModalOpen,
      signIn, signUp, signOut,
      sidebarOpen, toggleSidebar, mobilePanel, setMobilePanel,
      currentColor, setCurrentColor, brushType, setBrushType,
      brushSize, setBrushSize, strokes, addStroke,
      undoStack, redoStack, undo, redo, clearCanvas,
      zoom, setZoom,
      volume, setVolume, muted, setMuted,
      instrument, setInstrument,
      sonificationMode, setSonificationMode,
      isGenerating, generateProgress, generateSoundscape,
      savedDrawings, galleryLoading, saveCurrentDrawing, deleteDrawing, loadUserDrawings,
      dailyCount, dailyLimit, canvasRef,
    }}>
      {children}
    </AppContext.Provider>
  );
};
