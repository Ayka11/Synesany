import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { PIANO_KEYS, DEFAULT_COLORS, BrushType, InstrumentType } from '@/data/pianoKeys';
import {
  Palette, Paintbrush, Music, Wrench, ChevronDown, ChevronRight,
  Circle, Square, Sparkles, Star, PenTool, Pencil, Highlighter,
  Trash2, Undo2, Redo2, ZoomIn, ZoomOut
} from 'lucide-react';


const BRUSHES: { type: BrushType; icon: React.ReactNode; key: string }[] = [
  { type: 'round', icon: <Circle className="w-4 h-4" />, key: 'brush.round' },
  { type: 'square', icon: <Square className="w-4 h-4" />, key: 'brush.square' },
  { type: 'spray', icon: <Sparkles className="w-4 h-4" />, key: 'brush.spray' },
  { type: 'star', icon: <Star className="w-4 h-4" />, key: 'brush.star' },
  { type: 'calligraphy', icon: <PenTool className="w-4 h-4" />, key: 'brush.calligraphy' },
  { type: 'pencil', icon: <Pencil className="w-4 h-4" />, key: 'brush.pencil' },
  { type: 'marker', icon: <Highlighter className="w-4 h-4" />, key: 'brush.marker' },
];

const INSTRUMENTS: { type: InstrumentType; key: string }[] = [
  { type: 'flute', key: 'instrument.flute' },
  { type: 'bell', key: 'instrument.bell' },
  { type: 'guitar', key: 'instrument.guitar' },
  { type: 'bass', key: 'instrument.bass' },
  { type: 'piano', key: 'instrument.piano' },
];

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-accent/50 transition-colors"
      >
        {icon}
        <span className="text-xs font-semibold flex-1 text-left">{title}</span>
        {open ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
};

const BrushPreviewCanvas: React.FC<{ brush: BrushType; color: string; size: number }> = ({ brush, color, size }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 60, 40);
    ctx.fillStyle = color;
    const cx = 30, cy = 20;
    const s = Math.min(size, 12);

    switch (brush) {
      case 'round':
        ctx.beginPath();
        ctx.arc(cx, cy, s, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(cx - s, cy - s, s * 2, s * 2);
        break;
      case 'spray':
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * s * 1.5;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 1, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'star': {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const x = cx + Math.cos(angle) * s;
          const y = cy + Math.sin(angle) * s;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'calligraphy':
        ctx.beginPath();
        ctx.ellipse(cx, cy, s * 1.5, s * 0.4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'pencil':
        ctx.beginPath();
        ctx.arc(cx, cy, s * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(cx, cy, s, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        break;
      case 'marker':
        ctx.globalAlpha = 0.7;
        ctx.fillRect(cx - s, cy - s * 0.6, s * 2, s * 1.2);
        ctx.globalAlpha = 1;
        break;

    }
  }, [brush, color, size]);

  return (
    <canvas
      ref={canvasRef}
      width={60}
      height={40}
      className="rounded-lg border border-border/30 bg-background/50"
    />
  );
};

const Sidebar: React.FC = () => {
  const {
    currentColor, setCurrentColor,
    brushType, setBrushType,
    brushSize, setBrushSize,
    volume, setVolume, muted, setMuted,
    instrument, setInstrument,
    undo, redo, clearCanvas,
    zoom, setZoom,
    undoStack, redoStack,
    sidebarOpen,
  } = useAppContext();
  const { t } = useTranslation();
  const [colorTab, setColorTab] = useState<'custom' | 'rainbow'>('custom');

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 border-r border-border/30 bg-background/60 backdrop-blur-xl overflow-y-auto flex-shrink-0 hidden md:block">
      {/* Colors Section */}
      <Section title={t('sidebar.colors')} icon={<Palette className="w-4 h-4 text-pink-500" />}>
        {/* Color preview */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-xl border-2 border-border shadow-inner"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex-1">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-full h-8 rounded-lg cursor-pointer border-0"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setColorTab('custom')}
            className={`flex-1 text-[10px] font-medium py-1 rounded-md transition-colors ${
              colorTab === 'custom' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            {t('custom.colors')}
          </button>
          <button
            onClick={() => setColorTab('rainbow')}
            className={`flex-1 text-[10px] font-medium py-1 rounded-md transition-colors ${
              colorTab === 'rainbow' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'
            }`}
          >
            {t('rainbow.spectrum')}
          </button>
        </div>

        {colorTab === 'custom' ? (
          <div className="grid grid-cols-10 gap-1">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-full aspect-square rounded-md border transition-all hover:scale-110 ${
                  currentColor === color ? 'border-primary ring-1 ring-primary scale-110' : 'border-border/30'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-11 gap-0.5 max-h-48 overflow-y-auto">
            {PIANO_KEYS.map((key) => (
              <button
                key={key.note}
                onClick={() => setCurrentColor(key.color)}
                title={`${key.note} (${key.freq.toFixed(0)} Hz)`}
                className={`w-full aspect-square rounded-sm transition-all hover:scale-125 hover:z-10 ${
                  currentColor === key.color ? 'ring-1 ring-white scale-125 z-10' : ''
                }`}
                style={{ backgroundColor: key.color }}
              />
            ))}
          </div>
        )}
      </Section>

      {/* Brushes Section */}
      <Section title={t('sidebar.brushes')} icon={<Paintbrush className="w-4 h-4 text-blue-500" />}>
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {BRUSHES.map(b => (
            <button
              key={b.type}
              onClick={() => setBrushType(b.type)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all text-[9px] ${
                brushType === b.type
                  ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                  : 'hover:bg-accent text-muted-foreground'
              }`}
            >
              {b.icon}
              <span>{t(b.key)}</span>
            </button>
          ))}
        </div>

        {/* Brush preview */}
        <div className="flex items-center gap-2 mb-2">
          <BrushPreviewCanvas brush={brushType} color={currentColor} size={brushSize} />
          <div className="flex-1 text-[10px] text-muted-foreground">
            {t(BRUSHES.find(b => b.type === brushType)?.key || '')}
          </div>
        </div>

        {/* Size slider */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-8">{t('brush.size')}</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="flex-1 h-1 accent-primary"
          />
          <span className="text-[10px] font-mono w-6 text-right">{brushSize}</span>
        </div>
      </Section>

      {/* Sound Section */}
      <Section title={t('sidebar.sound')} icon={<Music className="w-4 h-4 text-green-500" />}>
        {/* Volume */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setMuted(!muted)}
            className={`p-1 rounded-md transition-colors ${muted ? 'text-destructive' : 'text-foreground'}`}
          >
            {muted ? <span className="text-[10px]">OFF</span> : <span className="text-[10px]">ON</span>}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (v > 0 && muted) setMuted(false);
            }}
            className="flex-1 h-1 accent-primary"
          />
          <span className="text-[10px] font-mono w-8 text-right">{Math.round(volume * 100)}%</span>
        </div>

        {/* Instrument */}
        <div className="space-y-1">
          <span className="text-[10px] text-muted-foreground font-medium">{t('sound.instrument')}</span>
          <div className="grid grid-cols-2 gap-1">
            {INSTRUMENTS.map(inst => (
              <button
                key={inst.type}
                onClick={() => setInstrument(inst.type)}
                className={`text-[10px] py-1.5 px-2 rounded-md transition-all ${
                  instrument === inst.type
                    ? 'bg-primary/15 text-primary font-medium'
                    : 'hover:bg-accent text-muted-foreground'
                }`}
              >
                {t(inst.key)}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Tools Section */}
      <Section title={t('sidebar.tools')} icon={<Wrench className="w-4 h-4 text-orange-500" />}>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="flex items-center gap-1.5 text-[10px] p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-30"
          >
            <Undo2 className="w-3.5 h-3.5" /> {t('tool.undo')}
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="flex items-center gap-1.5 text-[10px] p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-30"
          >
            <Redo2 className="w-3.5 h-3.5" /> {t('tool.redo')}
          </button>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            className="flex items-center gap-1.5 text-[10px] p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" /> {t('tool.zoomIn')}
          </button>
          <button
            onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
            className="flex items-center gap-1.5 text-[10px] p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" /> {t('tool.zoomOut')}
          </button>
        </div>
        <button
          onClick={clearCanvas}
          className="w-full flex items-center justify-center gap-1.5 text-[10px] p-2 mt-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> {t('tool.clear')}
        </button>
        <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-muted-foreground">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </Section>
    </aside>
  );
};

export default Sidebar;
